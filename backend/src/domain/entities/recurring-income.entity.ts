import {
  IncomeTaxationIrrfMode,
  IncomeTaxationProfile,
  MeProLaboreTaxationParametersDTO,
} from "../../dtos/monthly-income.dto";
import { UnprocessableEntityError } from "../../utils/errors";
import { Month } from "./month.entity";
import { IncomeType, TaxationModeType } from "./monthly-income.entity";
import { User } from "./user.entity";

export enum RecurringIncomeKind {
  FIXED_SALARY = "fixed_salary",
  RECURRING_EXTRA = "recurring_extra",
}

export enum RecurringIncomeStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

const DEFAULT_DAS_RATE = 0.06;
const DEFAULT_PRO_LABORE_RATE = 0.28;
const DEFAULT_INSS_RATE = 0.11;

export interface RecurringIncome {
  id: string;
  user: User;
  description: string;
  grossIncome: number;
  incomeType: IncomeType;
  kind: RecurringIncomeKind;
  startMonth: Month;
  occurrences?: number;
  status: RecurringIncomeStatus;
  taxationMode: TaxationModeType;
  taxationProfile?: IncomeTaxationProfile; // todo: identificr valores.
  taxationParameters?: MeProLaboreTaxationParametersDTO;
  createdAt: Date;
  updatedAt: Date;

  validateBaseFields(): void;
  normalizeTaxation(): void;
}

export class RecurringIncomeEntity implements RecurringIncome {
  id: string;
  user: User;
  description: string;
  grossIncome: number;
  incomeType: IncomeType;
  kind: RecurringIncomeKind;
  startMonth: Month;
  occurrences?: number;
  status: RecurringIncomeStatus;
  taxationMode: TaxationModeType;
  taxationProfile?: IncomeTaxationProfile; // todo: identificr valores.
  taxationParameters?: MeProLaboreTaxationParametersDTO;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<RecurringIncome>) {
    Object.assign(this, data);
  }

  validateBaseFields() {
    if (!this.description || this.description.length > 255) {
      throw new Error(
        "Description is required and must be at most 255 characters",
      );
    }

    if (this.grossIncome <= 0) {
      throw new Error("Recurring income amount must be greater than zero");
    }

    if (!this.incomeType) {
      throw new Error("Income type is required");
    }

    if (!Object.values(RecurringIncomeKind).includes(this.kind)) {
      throw new Error(
        "Recurring income kind must be fixed_salary or recurring_extra",
      );
    }

    if (!Object.values(RecurringIncomeStatus).includes(this.status)) {
      throw new Error("Status must be active or inactive");
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
}
