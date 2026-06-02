import { IncomeTax } from "../../../../domain/entities/income-tax.entity";

export interface IncomeTaxResponse {
  id: string;
  monthly_income_id: string;
  tax_type: string;
  value: number;
  is_auto: boolean;
  created_at: Date;
  updated_at: Date;
}

export function toIncomeTaxResponse(tax: IncomeTax): IncomeTaxResponse {
  return {
    id: tax.id,
    monthly_income_id: tax.monthlyIncome.id,
    tax_type: tax.taxType,
    value: tax.value,
    is_auto: tax.isAuto,
    created_at: tax.createdAt,
    updated_at: tax.updatedAt,
  };
}
