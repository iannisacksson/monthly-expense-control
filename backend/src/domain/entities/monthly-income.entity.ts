import {
  IncomeTaxationIrrfMode,
  IncomeTaxationProfile,
  MeProLaboreTaxationParametersDTO,
} from "../../dtos/monthly-income.dto";
import { BadRequestError, UnprocessableEntityError } from "../../utils/errors";
import { Month } from "./month.entity";
import { RecurringIncome } from "./recurring-income.entity";
import { User } from "./user.entity";

const DEFAULT_DAS_RATE = 0.06;
const DEFAULT_PRO_LABORE_RATE = 0.28;
const DEFAULT_INSS_RATE = 0.11;

export enum IncomeType {
  SALARY = "salary",
  BUSINESS = "business",
  INVESTMENT = "investment",
  OTHER = "other",
}

export enum TaxationModeType {
  MANUAL = "manual",
  AUTOMATIC = "automatic",
}

export interface CalculatedIncomeTax {
  tax_type: string;
  value: number;
  is_auto: true;
}

export interface MonthlyIncome {
  id: string;
  user: User;
  month: Month;
  recurringIncome?: RecurringIncome;
  grossIncome: number;
  incomeType: IncomeType;
  taxationMode: TaxationModeType;
  taxationProfile?: string; // todo: identificr valores.
  taxationParameters?: MeProLaboreTaxationParametersDTO;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;

  validateGrossIncome(): void;
  validateNotes(): void;
  normalizeTaxation(): void;
  calculateAutomaticTaxes(): CalculatedIncomeTax[];
}

export class MonthlyIncomeEntity implements MonthlyIncome {
  id: string;
  user: User;
  month: Month;
  recurringIncome?: RecurringIncome;
  grossIncome: number;
  incomeType: IncomeType;
  taxationMode: TaxationModeType;
  taxationProfile?: string; // todo: identificr valores.
  taxationParameters?: MeProLaboreTaxationParametersDTO;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<MonthlyIncome>) {
    Object.assign(this, data);
  }

  validateGrossIncome() {
    if (this.grossIncome <= 0) {
      throw new BadRequestError("Income amount must be greater than zero");
    }
  }

  validateNotes() {
    if (this.notes && this.notes.length > 255) {
      throw new BadRequestError("Income notes must be at most 255 characters");
    }
  }

  normalizeTaxation() {
    if (!this.taxationMode || this.taxationMode === TaxationModeType.MANUAL) {
      this.taxationProfile = undefined;
      this.taxationParameters = undefined;
    }

    if (this.taxationMode !== TaxationModeType.AUTOMATIC) {
      throw new UnprocessableEntityError("Invalid taxation mode");
    }

    if (this.taxationProfile !== IncomeTaxationProfile.ME_PRO_LABORE) {
      throw new UnprocessableEntityError("Unsupported taxation profile");
    }

    const parameters = this.normalizeMeProLaboreParameters(
      this.taxationParameters,
    );

    this.taxationMode = TaxationModeType.AUTOMATIC;
    this.taxationProfile = IncomeTaxationProfile.ME_PRO_LABORE;
    this.taxationParameters = parameters;
  }

  private normalizeMeProLaboreParameters(
    parameters?: MeProLaboreTaxationParametersDTO | null,
  ): MeProLaboreTaxationParametersDTO {
    if (!parameters) {
      throw new Error(
        "Taxation parameters are required for the selected profile",
      );
    }

    const accountantFee = Number(parameters.accountant_fee);
    const dasRate = Number(parameters.das_rate ?? DEFAULT_DAS_RATE);
    const proLaboreRate = Number(
      parameters.pro_labore_rate ?? DEFAULT_PRO_LABORE_RATE,
    );
    const inssRate = Number(parameters.inss_rate ?? DEFAULT_INSS_RATE);
    const irrfMode = parameters.irrf_mode ?? IncomeTaxationIrrfMode.DISABLED;
    const irrfManualAmount =
      parameters.irrf_manual_amount !== undefined
        ? Number(parameters.irrf_manual_amount)
        : undefined;

    if (!Number.isFinite(accountantFee) || accountantFee < 0) {
      throw new Error("Accountant fee must be greater than or equal to zero");
    }

    this.validateRate(dasRate, "DAS rate");
    this.validateRate(proLaboreRate, "Pro labore rate");
    this.validateRate(inssRate, "INSS rate");

    if (
      irrfMode !== IncomeTaxationIrrfMode.DISABLED &&
      irrfMode !== IncomeTaxationIrrfMode.MANUAL_AMOUNT
    ) {
      throw new Error("Invalid IRRF mode");
    }

    if (irrfMode === IncomeTaxationIrrfMode.MANUAL_AMOUNT) {
      if (
        irrfManualAmount === undefined ||
        !Number.isFinite(irrfManualAmount) ||
        irrfManualAmount < 0
      ) {
        throw new Error(
          "IRRF manual amount must be greater than or equal to zero",
        );
      }
    }

    return {
      accountant_fee: this.roundMoney(accountantFee),
      das_rate: dasRate,
      pro_labore_rate: proLaboreRate,
      inss_rate: inssRate,
      irrf_mode: irrfMode,
      irrf_manual_amount:
        irrfMode === IncomeTaxationIrrfMode.MANUAL_AMOUNT
          ? this.roundMoney(irrfManualAmount ?? 0)
          : undefined,
    };
  }

  private validateRate(rate: number, label: string) {
    if (!Number.isFinite(rate) || rate < 0 || rate > 1) {
      throw new Error(`${label} must be between zero and one`);
    }
  }

  private roundMoney(value: number) {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }

  calculateAutomaticTaxes(): CalculatedIncomeTax[] {
    if (
      this.taxationMode !== TaxationModeType.AUTOMATIC ||
      this.taxationProfile !== IncomeTaxationProfile.ME_PRO_LABORE
    ) {
      return [];
    }

    const parameters = this.taxationParameters;
    const dasRate = Number(parameters?.das_rate ?? DEFAULT_DAS_RATE);
    const proLaboreRate = Number(
      parameters?.pro_labore_rate ?? DEFAULT_PRO_LABORE_RATE,
    );
    const inssRate = Number(parameters?.inss_rate ?? DEFAULT_INSS_RATE);
    const irrfMode = parameters?.irrf_mode ?? IncomeTaxationIrrfMode.DISABLED;
    const accountantFee = Number(parameters?.accountant_fee);
    const proLabore = this.roundMoney(this.grossIncome * proLaboreRate);
    const das = this.roundMoney(this.grossIncome * dasRate);
    const inss = this.roundMoney(proLabore * inssRate);
    const irrf =
      irrfMode === IncomeTaxationIrrfMode.MANUAL_AMOUNT
        ? this.roundMoney(Number(parameters?.irrf_manual_amount ?? 0))
        : 0;

    return [
      { tax_type: "DAS", value: das, is_auto: true },
      { tax_type: "INSS", value: inss, is_auto: true },
      { tax_type: "IRRF", value: irrf, is_auto: true },
      {
        tax_type: "CONTADOR",
        value: this.roundMoney(accountantFee),
        is_auto: true,
      },
    ];
  }
}
