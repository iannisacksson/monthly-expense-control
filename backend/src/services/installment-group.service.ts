import { InstallmentGroupRepository } from "../repositories/installment-group.repository"
import { ExpenseRepository } from "../repositories/expense.repository"
import { MonthRepository } from "../repositories/month.repository"
import { FamilyRepository } from "../repositories/family.repository"
import { CategoryRepository } from "../repositories/category.repository"
import { SubcategoryRepository } from "../repositories/subcategory.repository"
import { UserRepository } from "../repositories/user.repository"
import { CreateInstallmentGroupDTO, InstallmentGroupScope, UpdateInstallmentGroupDTO } from "../dtos/installment-group.dto"

const installmentGroupRepository = new InstallmentGroupRepository()
const expenseRepository = new ExpenseRepository()
const monthRepository = new MonthRepository()
const familyRepository = new FamilyRepository()
const categoryRepository = new CategoryRepository()
const subcategoryRepository = new SubcategoryRepository()
const userRepository = new UserRepository()

export class InstallmentGroupService {
  private async findMonthByIdOrThrow(id: string) {
    const month = await monthRepository.findById(id)
    if (!month) {
      throw new Error("Month not found")
    }
    return month
  }

  private getMonthDistance(startMonth: any, targetMonth: any) {
    const startYear = startMonth.getDataValue("year") as number
    const startMonthNumber = startMonth.getDataValue("month") as number
    const targetYear = targetMonth.getDataValue("year") as number
    const targetMonthNumber = targetMonth.getDataValue("month") as number
    const distance = ((targetYear - startYear) * 12) + (targetMonthNumber - startMonthNumber)

    if (distance < 0) {
      throw new Error("Effective month must be on or after the start month")
    }

    return distance
  }

  private getMonthDate(month: any) {
    const year = month.getDataValue("year") as number
    const monthNumber = month.getDataValue("month") as number
    return `${year}-${String(monthNumber).padStart(2, "0")}-01`
  }

  private async ensureMonth(params: { userId?: string; familyId?: string; year: number; month: number }) {
    let targetMonth = params.userId
      ? await monthRepository.findByUserAndPeriod(params.userId, params.year, params.month)
      : params.familyId
        ? await monthRepository.findByFamilyAndPeriod(params.familyId, params.year, params.month)
        : null

    if (!targetMonth) {
      targetMonth = await monthRepository.create({
        user_id: params.userId,
        family_id: params.familyId,
        year: params.year,
        month: params.month,
        status: "open"
      })
    }

    return targetMonth
  }

  private validateBaseFields(params: {
    totalValue: number
    installments: number
    startingInstallmentNumber: number
  }) {
    if (params.totalValue <= 0) {
      throw new Error("Total value must be greater than zero")
    }

    if (params.installments < 2) {
      throw new Error("Installments must be at least 2")
    }

    if (params.startingInstallmentNumber < 1 || params.startingInstallmentNumber > params.installments) {
      throw new Error("Starting installment number must be between 1 and total installments")
    }
  }

  private async getEffectiveMonthContext(startMonthId: string, effectiveMonthId?: string) {
    if (!effectiveMonthId) {
      throw new Error("effective_month_id is required for this scope")
    }

    const startMonth = await this.findMonthByIdOrThrow(startMonthId)
    const effectiveMonth = await this.findMonthByIdOrThrow(effectiveMonthId)
    const distance = this.getMonthDistance(startMonth, effectiveMonth)

    return {
      startMonth,
      effectiveMonth,
      distance,
      effectiveDate: this.getMonthDate(effectiveMonth),
    }
  }

  private async createInstallmentExpenseEntry(data: {
    installmentGroupId: string
    userId?: string
    familyId?: string
    description: string
    totalValue: number
    installments: number
    categoryId: string
    subcategoryId?: string
    paidBy?: string
    responsibleUserId?: string
    monthId: string
    installmentNumber: number
  }) {
    const month = await this.findMonthByIdOrThrow(data.monthId)
    const existingExpense = await expenseRepository.findInstallmentExpenseEntry(data.installmentGroupId, data.monthId)

    if (existingExpense) {
      return existingExpense
    }

    await expenseRepository.create({
      user_id: data.userId,
      family_id: data.familyId,
      month_id: data.monthId,
      category_id: data.categoryId,
      subcategory_id: data.subcategoryId,
      paid_by: data.paidBy,
      responsible_user_id: data.responsibleUserId,
      installment_group_id: data.installmentGroupId,
      description: `${data.description} (${data.installmentNumber}/${data.installments})`,
      value: Number((data.totalValue / data.installments).toFixed(2)),
      expense_date: this.getMonthDate(month)
    })

    return expenseRepository.findInstallmentExpenseEntry(data.installmentGroupId, data.monthId)
  }

  private async generateInstallmentExpenses(data: {
    installmentGroupId: string
    userId?: string
    familyId?: string
    description: string
    totalValue: number
    installments: number
    startingInstallmentNumber: number
    categoryId: string
    subcategoryId?: string
    paidBy?: string
    responsibleUserId?: string
    startMonthId: string
  }) {
    const startMonth = await this.findMonthByIdOrThrow(data.startMonthId)
    const startYear = startMonth.getDataValue("year") as number
    const startMonthNum = startMonth.getDataValue("month") as number
    const remainingInstallments = data.installments - data.startingInstallmentNumber + 1

    for (let i = 0; i < remainingInstallments; i++) {
      let targetMonth = startMonthNum + i
      let targetYear = startYear
      const installmentNumber = data.startingInstallmentNumber + i

      while (targetMonth > 12) {
        targetMonth -= 12
        targetYear += 1
      }

      const month = await this.ensureMonth({
        userId: data.userId,
        familyId: data.familyId,
        year: targetYear,
        month: targetMonth,
      })

      await this.createInstallmentExpenseEntry({
        installmentGroupId: data.installmentGroupId,
        userId: data.userId,
        familyId: data.familyId,
        description: data.description,
        totalValue: data.totalValue,
        installments: data.installments,
        categoryId: data.categoryId,
        subcategoryId: data.subcategoryId,
        paidBy: data.paidBy,
        responsibleUserId: data.responsibleUserId,
        monthId: month.getDataValue("id") as string,
        installmentNumber,
      })
    }
  }

  private async validateCategoryAndSubcategory(params: {
    userId?: string
    familyId?: string
    categoryId: string
    subcategoryId?: string
  }) {
    const category = await categoryRepository.findById(params.categoryId)
    if (!category) {
      throw new Error("Category not found")
    }

    const categoryUserId = category.getDataValue("user_id") as string | null
    const categoryFamilyId = category.getDataValue("family_id") as string | null
    const isSameOwner = (params.userId && categoryUserId === params.userId)
      || (!!params.familyId && categoryFamilyId === params.familyId)

    if (!isSameOwner) {
      throw new Error("Category must belong to the same owner as the installment purchase")
    }

    if (params.subcategoryId) {
      const subcategory = await subcategoryRepository.findById(params.subcategoryId)
      if (!subcategory) {
        throw new Error("Subcategory not found")
      }

      if (subcategory.getDataValue("category_id") !== params.categoryId) {
        throw new Error("Subcategory must belong to the selected category")
      }
    }
  }

  async createInstallmentPurchase(data: CreateInstallmentGroupDTO) {
    if (!data.user_id && !data.family_id) {
      throw new Error("Installment group must belong to a user or a legacy family context")
    }

    this.validateBaseFields({
      totalValue: data.total_value,
      installments: data.installments,
      startingInstallmentNumber: data.starting_installment_number,
    })

    await this.validateCategoryAndSubcategory({
      userId: data.user_id,
      familyId: data.family_id,
      categoryId: data.category_id,
      subcategoryId: data.subcategory_id,
    })

    if (data.user_id) {
      const user = await userRepository.findById(data.user_id)
      if (!user) {
        throw new Error("User not found")
      }
    }

    if (data.family_id) {
      const family = await familyRepository.findById(data.family_id)
      if (!family) {
        throw new Error("Family not found")
      }
    }

    const startMonth = await monthRepository.findById(data.start_month_id)
    if (!startMonth) {
      throw new Error("Start month not found")
    }

    if (data.user_id && startMonth.getDataValue("user_id") !== data.user_id) {
      throw new Error("Start month must belong to the same user as the installment purchase")
    }

    if (data.family_id && startMonth.getDataValue("family_id") !== data.family_id) {
      throw new Error("Start month must belong to the same family as the installment purchase")
    }

    const group = await installmentGroupRepository.create({
      user_id: data.user_id,
      family_id: data.family_id,
      description: data.description,
      total_value: data.total_value,
      installments: data.installments,
      starting_installment_number: data.starting_installment_number,
      category_id: data.category_id,
      subcategory_id: data.subcategory_id,
      paid_by: data.paid_by,
      responsible_user_id: data.responsible_user_id,
      start_month_id: data.start_month_id,
    })

    await this.generateInstallmentExpenses({
      installmentGroupId: group.getDataValue("id") as string,
      userId: data.user_id,
      familyId: data.family_id,
      description: data.description,
      totalValue: data.total_value,
      installments: data.installments,
      startingInstallmentNumber: data.starting_installment_number,
      categoryId: data.category_id,
      subcategoryId: data.subcategory_id,
      paidBy: data.paid_by,
      responsibleUserId: data.responsible_user_id,
      startMonthId: data.start_month_id,
    })

    return group
  }

  async findInstallmentGroupById(id: string) {
    const group = await installmentGroupRepository.findById(id)
    if (!group) {
      throw new Error("Installment group not found")
    }
    return group
  }

  async listInstallmentGroupsByFamily(familyId: string) {
    return installmentGroupRepository.findByFamilyId(familyId)
  }

  async listInstallmentGroupsByUser(userId: string) {
    return installmentGroupRepository.findByUserId(userId)
  }

  async findExpensesByInstallmentGroup(installmentGroupId: string) {
    return expenseRepository.findByInstallmentGroupId(installmentGroupId)
  }

  private async updateWholeSeries(id: string, existingGroup: any, data: UpdateInstallmentGroupDTO) {
    const nextDescription = data.description ?? (existingGroup.getDataValue("description") as string)
    const nextTotalValue = data.total_value ?? Number(existingGroup.getDataValue("total_value"))
    const nextInstallments = data.installments ?? (existingGroup.getDataValue("installments") as number)
    const nextCategoryId = data.category_id ?? (existingGroup.getDataValue("category_id") as string)
    const nextSubcategoryId = data.subcategory_id !== undefined
      ? data.subcategory_id
      : (existingGroup.getDataValue("subcategory_id") as string | undefined)
    const nextPaidBy = data.paid_by !== undefined ? data.paid_by : (existingGroup.getDataValue("paid_by") as string | undefined)
    const nextResponsibleUserId = data.responsible_user_id !== undefined
      ? data.responsible_user_id
      : (existingGroup.getDataValue("responsible_user_id") as string | undefined)
    const nextStartingInstallmentNumber = existingGroup.getDataValue("starting_installment_number") as number
    const familyId = existingGroup.getDataValue("family_id") as string | undefined
    const userId = existingGroup.getDataValue("user_id") as string | undefined

    this.validateBaseFields({
      totalValue: nextTotalValue,
      installments: nextInstallments,
      startingInstallmentNumber: nextStartingInstallmentNumber,
    })

    await this.validateCategoryAndSubcategory({
      userId,
      familyId,
      categoryId: nextCategoryId,
      subcategoryId: nextSubcategoryId,
    })

    const group = await installmentGroupRepository.update(id, {
      description: nextDescription,
      total_value: nextTotalValue,
      installments: nextInstallments,
      category_id: nextCategoryId,
      subcategory_id: nextSubcategoryId,
      paid_by: nextPaidBy,
      responsible_user_id: nextResponsibleUserId,
    })

    if (!group) {
      throw new Error("Installment group not found")
    }

    await expenseRepository.deleteByInstallmentGroupId(id)
    await this.generateInstallmentExpenses({
      installmentGroupId: id,
      userId,
      familyId,
      description: nextDescription,
      totalValue: nextTotalValue,
      installments: nextInstallments,
      startingInstallmentNumber: nextStartingInstallmentNumber,
      categoryId: nextCategoryId,
      subcategoryId: nextSubcategoryId,
      paidBy: nextPaidBy,
      responsibleUserId: nextResponsibleUserId,
      startMonthId: group.getDataValue("start_month_id") as string,
    })

    return group
  }

  async updateInstallmentGroup(id: string, data: UpdateInstallmentGroupDTO) {
    const existingGroup = await installmentGroupRepository.findById(id)
    if (!existingGroup) {
      throw new Error("Installment group not found")
    }

    const scope: InstallmentGroupScope = data.scope ?? "whole_series"

    if (scope === "whole_series") {
      return this.updateWholeSeries(id, existingGroup, data)
    }

    const startMonthId = existingGroup.getDataValue("start_month_id") as string
    const { distance, effectiveDate } = await this.getEffectiveMonthContext(startMonthId, data.effective_month_id)
    const startingInstallmentNumber = existingGroup.getDataValue("starting_installment_number") as number
    const installments = existingGroup.getDataValue("installments") as number
    const effectiveInstallmentNumber = startingInstallmentNumber + distance

    if (effectiveInstallmentNumber > installments) {
      throw new Error("Effective month is outside the installment range")
    }

    if (scope === "single_occurrence") {
      const occurrence = await expenseRepository.findInstallmentExpenseEntry(id, data.effective_month_id as string)
      if (!occurrence) {
        throw new Error("Installment occurrence not found for the selected month")
      }

      const nextCategoryId = data.category_id ?? (occurrence.getDataValue("category_id") as string)
      const nextSubcategoryId = data.subcategory_id !== undefined
        ? data.subcategory_id
        : (occurrence.getDataValue("subcategory_id") as string | undefined)

      await this.validateCategoryAndSubcategory({
        userId: existingGroup.getDataValue("user_id") as string | undefined,
        familyId: existingGroup.getDataValue("family_id") as string | undefined,
        categoryId: nextCategoryId,
        subcategoryId: nextSubcategoryId,
      })

      return expenseRepository.update(occurrence.getDataValue("id") as string, {
        description: data.description ?? (occurrence.getDataValue("description") as string),
        value: data.total_value !== undefined && data.installments !== undefined
          ? Number((data.total_value / data.installments).toFixed(2))
          : Number(occurrence.getDataValue("value")),
        category_id: nextCategoryId,
        subcategory_id: nextSubcategoryId,
        paid_by: data.paid_by !== undefined ? data.paid_by : (occurrence.getDataValue("paid_by") as string | undefined),
        responsible_user_id: data.responsible_user_id !== undefined
          ? data.responsible_user_id
          : (occurrence.getDataValue("responsible_user_id") as string | undefined),
      })
    }

    if (distance === 0) {
      return this.updateWholeSeries(id, existingGroup, data)
    }

    const nextDescription = data.description ?? (existingGroup.getDataValue("description") as string)
    const nextTotalValue = data.total_value ?? Number(existingGroup.getDataValue("total_value"))
    const nextInstallments = data.installments ?? (existingGroup.getDataValue("installments") as number)
    const nextCategoryId = data.category_id ?? (existingGroup.getDataValue("category_id") as string)
    const nextSubcategoryId = data.subcategory_id !== undefined
      ? data.subcategory_id
      : (existingGroup.getDataValue("subcategory_id") as string | undefined)
    const nextPaidBy = data.paid_by !== undefined ? data.paid_by : (existingGroup.getDataValue("paid_by") as string | undefined)
    const nextResponsibleUserId = data.responsible_user_id !== undefined
      ? data.responsible_user_id
      : (existingGroup.getDataValue("responsible_user_id") as string | undefined)
    const familyId = existingGroup.getDataValue("family_id") as string | undefined
    const userId = existingGroup.getDataValue("user_id") as string | undefined
    const currentInstallmentValue = Number(existingGroup.getDataValue("total_value")) / installments

    this.validateBaseFields({
      totalValue: nextTotalValue,
      installments: nextInstallments,
      startingInstallmentNumber: effectiveInstallmentNumber,
    })

    await this.validateCategoryAndSubcategory({
      userId,
      familyId,
      categoryId: nextCategoryId,
      subcategoryId: nextSubcategoryId,
    })

    await expenseRepository.deleteByInstallmentGroupIdFromDate(id, effectiveDate)
    await installmentGroupRepository.update(id, {
      installments: effectiveInstallmentNumber - 1,
      total_value: Number((currentInstallmentValue * (effectiveInstallmentNumber - 1)).toFixed(2)),
    })

    const newGroup = await installmentGroupRepository.create({
      user_id: userId,
      family_id: familyId,
      description: nextDescription,
      total_value: nextTotalValue,
      installments: nextInstallments,
      starting_installment_number: effectiveInstallmentNumber,
      category_id: nextCategoryId,
      subcategory_id: nextSubcategoryId,
      paid_by: nextPaidBy,
      responsible_user_id: nextResponsibleUserId,
      start_month_id: data.effective_month_id as string,
    })

    await this.generateInstallmentExpenses({
      installmentGroupId: newGroup.getDataValue("id") as string,
      userId,
      familyId,
      description: nextDescription,
      totalValue: nextTotalValue,
      installments: nextInstallments,
      startingInstallmentNumber: effectiveInstallmentNumber,
      categoryId: nextCategoryId,
      subcategoryId: nextSubcategoryId,
      paidBy: nextPaidBy,
      responsibleUserId: nextResponsibleUserId,
      startMonthId: data.effective_month_id as string,
    })

    return newGroup
  }

  async deleteInstallmentGroup(id: string, params?: { scope?: InstallmentGroupScope; effective_month_id?: string }) {
    const existingGroup = await installmentGroupRepository.findById(id)
    if (!existingGroup) {
      throw new Error("Installment group not found")
    }

    const scope = params?.scope ?? "whole_series"

    if (scope === "whole_series") {
      await expenseRepository.deleteByInstallmentGroupId(id)

      const group = await installmentGroupRepository.delete(id)
      if (!group) {
        throw new Error("Installment group not found")
      }
      return group
    }

    const startMonthId = existingGroup.getDataValue("start_month_id") as string
    const { distance, effectiveDate } = await this.getEffectiveMonthContext(startMonthId, params?.effective_month_id)
    const startingInstallmentNumber = existingGroup.getDataValue("starting_installment_number") as number
    const installments = existingGroup.getDataValue("installments") as number
    const effectiveInstallmentNumber = startingInstallmentNumber + distance

    if (effectiveInstallmentNumber > installments) {
      throw new Error("Effective month is outside the installment range")
    }

    if (scope === "single_occurrence") {
      const deletedOccurrence = await expenseRepository.findInstallmentExpenseEntry(id, params?.effective_month_id as string)
      if (!deletedOccurrence) {
        throw new Error("Installment occurrence not found for the selected month")
      }

      await expenseRepository.delete(deletedOccurrence.getDataValue("id") as string)
      return existingGroup
    }

    if (distance === 0) {
      await expenseRepository.deleteByInstallmentGroupId(id)
      const group = await installmentGroupRepository.delete(id)
      if (!group) {
        throw new Error("Installment group not found")
      }
      return group
    }

    const currentInstallmentValue = Number(existingGroup.getDataValue("total_value")) / installments

    await expenseRepository.deleteByInstallmentGroupIdFromDate(id, effectiveDate)
    const updatedGroup = await installmentGroupRepository.update(id, {
      installments: effectiveInstallmentNumber - 1,
      total_value: Number((currentInstallmentValue * (effectiveInstallmentNumber - 1)).toFixed(2)),
    })

    if (!updatedGroup) {
      throw new Error("Installment group not found")
    }

    return updatedGroup
  }

  async restoreInstallmentOccurrence(id: string, monthId: string) {
    const group = await installmentGroupRepository.findById(id)
    if (!group) {
      throw new Error("Installment group not found")
    }

    const startMonthId = group.getDataValue("start_month_id") as string
    const { distance } = await this.getEffectiveMonthContext(startMonthId, monthId)
    const startingInstallmentNumber = group.getDataValue("starting_installment_number") as number
    const installments = group.getDataValue("installments") as number
    const installmentNumber = startingInstallmentNumber + distance

    if (installmentNumber > installments) {
      throw new Error("Selected month is outside the installment range")
    }

    return this.createInstallmentExpenseEntry({
      installmentGroupId: id,
      userId: group.getDataValue("user_id") as string | undefined,
      familyId: group.getDataValue("family_id") as string | undefined,
      description: group.getDataValue("description") as string,
      totalValue: Number(group.getDataValue("total_value")),
      installments,
      categoryId: group.getDataValue("category_id") as string,
      subcategoryId: group.getDataValue("subcategory_id") as string | undefined,
      paidBy: group.getDataValue("paid_by") as string | undefined,
      responsibleUserId: group.getDataValue("responsible_user_id") as string | undefined,
      monthId,
      installmentNumber,
    })
  }
}
