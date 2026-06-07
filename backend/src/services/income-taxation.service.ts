import { TaxationModeType } from "../domain/entities/monthly-income.entity";
import {
  IncomeTaxationDTO,
  IncomeTaxationProfile,
  MeProLaboreTaxationParametersDTO,
} from "../dtos/monthly-income.dto";

interface CalculatedIncomeTax {
  tax_type: string;
  value: number;
  is_auto: true;
}

interface NormalizedIncomeTaxation {
  mode: TaxationModeType;
  profile?: IncomeTaxationProfile;
  parameters?: MeProLaboreTaxationParametersDTO;
}

const DEFAULT_DAS_RATE = 0.06;
const DEFAULT_PRO_LABORE_RATE = 0.28;
const DEFAULT_INSS_RATE = 0.11;

export class IncomeTaxationService {
  normalizeTaxation(
    taxation?: IncomeTaxationDTO | null,
  ): NormalizedIncomeTaxation {
    if (!taxation || taxation.mode === TaxationModeType.MANUAL) {
      return {
        mode: TaxationModeType.MANUAL,
      };
    }

    if (taxation.mode !== TaxationModeType.AUTOMATIC) {
      throw new Error("Invalid taxation mode");
    }

    if (taxation.profile !== "me_pro_labore") {
      throw new Error("Unsupported taxation profile");
    }

    const parameters = this.normalizeMeProLaboreParameters(taxation.parameters);

    return {
      mode: TaxationModeType.AUTOMATIC,
      profile: "me_pro_labore",
      parameters,
    };
  }

  calculateAutomaticTaxes(
    grossIncome: number,
    taxation: NormalizedIncomeTaxation,
  ): CalculatedIncomeTax[] {
    if (taxation.mode !== "automatic" || taxation.profile !== "me_pro_labore") {
      return [];
    }

    const parameters = taxation.parameters as MeProLaboreTaxationParametersDTO;
    const dasRate = Number(parameters.das_rate ?? DEFAULT_DAS_RATE);
    const proLaboreRate = Number(
      parameters.pro_labore_rate ?? DEFAULT_PRO_LABORE_RATE,
    );
    const inssRate = Number(parameters.inss_rate ?? DEFAULT_INSS_RATE);
    const irrfMode = parameters.irrf_mode ?? "disabled";
    const accountantFee = Number(parameters.accountant_fee);
    const proLabore = this.roundMoney(grossIncome * proLaboreRate);
    const das = this.roundMoney(grossIncome * dasRate);
    const inss = this.roundMoney(proLabore * inssRate);
    const irrf =
      irrfMode === "manual_amount"
        ? this.roundMoney(Number(parameters.irrf_manual_amount ?? 0))
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

  private normalizeMeProLaboreParameters(
    parameters?: MeProLaboreTaxationParametersDTO | null,
  ) {
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
    const irrfMode = parameters.irrf_mode ?? "disabled";
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

    if (irrfMode !== "disabled" && irrfMode !== "manual_amount") {
      throw new Error("Invalid IRRF mode");
    }

    if (irrfMode === "manual_amount") {
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
        irrfMode === "manual_amount"
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
