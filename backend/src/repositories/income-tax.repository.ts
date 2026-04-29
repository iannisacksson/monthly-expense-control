import type { Transaction } from "sequelize"
import { IncomeTax } from "../models/index"

export class IncomeTaxRepository {
  async create(data: {
    monthly_income_id: string
    tax_type: string
    value: number
    is_auto: boolean
  }, options?: { transaction?: Transaction }) {
    return IncomeTax.create(data, options)
  }

  async createMany(data: Array<{
    monthly_income_id: string
    tax_type: string
    value: number
    is_auto: boolean
  }>, options?: { transaction?: Transaction }) {
    return IncomeTax.bulkCreate(data, options)
  }

  async findById(id: string) {
    return IncomeTax.findByPk(id)
  }

  async findByMonthlyIncomeId(monthlyIncomeId: string) {
    return IncomeTax.findAll({ where: { monthly_income_id: monthlyIncomeId } })
  }

  async deleteAutoByMonthlyIncomeId(monthlyIncomeId: string, options?: { transaction?: Transaction }) {
    return IncomeTax.destroy({ where: { monthly_income_id: monthlyIncomeId, is_auto: true }, ...options })
  }

  async update(id: string, data: Partial<{
    tax_type: string
    value: number
    is_auto: boolean
  }>) {
    const tax = await IncomeTax.findByPk(id)
    if (!tax) return null
    return tax.update(data)
  }

  async delete(id: string) {
    const tax = await IncomeTax.findByPk(id)
    if (!tax) return null
    await tax.destroy()
    return tax
  }
}
