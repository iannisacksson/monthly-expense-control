import { MonthlyIncome } from "./monthly-income.entity";

export interface IncomeTax {
  id: string;
  monthlyIncome: MonthlyIncome;
  taxType: string; // todo: mapear types
  value: number;
  isAuto: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class IncomeTaxEntity implements IncomeTax {
  id: string;
  monthlyIncome: MonthlyIncome;
  taxType: string; // todo: mapear types
  value: number;
  isAuto: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<IncomeTax>) {
    Object.assign(this, data);
  }
}
