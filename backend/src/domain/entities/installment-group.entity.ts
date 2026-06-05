import { Category } from "./category.entity";
import { Month } from "./month.entity";
import { Subcategory } from "./subcategory.entity";
import { User } from "./user.entity";

export enum InstallmentGroupScope {
  SINGLE_OCCURRENCE = "single_occurrence",
  FUTURE_OCCURRENCES = "future_occurrences",
  WHOLE_SERIES = "whole_series",
}

export interface InstallmentGroup {
  id: string;
  user: User;
  description: string;
  totalValue: number;
  installments: number;
  startingInstallmentNumber: number;
  category: Category;
  subcategory?: Subcategory;
  paidBy?: User;
  responsibleUser?: User;
  startMonth: Month;
  createdAt: Date;
  updatedAt: Date;
}

export class InstallmentGroupEntity implements InstallmentGroup {
  id: string;
  user: User;
  description: string;
  totalValue: number;
  installments: number;
  startingInstallmentNumber: number;
  category: Category;
  subcategory?: Subcategory;
  paidBy?: User;
  responsibleUser?: User;
  startMonth: Month;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<InstallmentGroup>) {
    Object.assign(this, data);
  }
}
