import type { BulkDeleteExpensesDTO, BulkMarkExpensesPaidDTO, CreateExpenseDTO, UpdateExpenseDTO } from "../../dtos/expense.dto"
import type { CreateExpenseItemDTO, UpdateExpenseItemDTO } from "../../dtos/expense-item.dto"
import { ExpenseService } from "../../services/expense.service"

const expenseService = new ExpenseService()

export class CreateExpenseUseCase { execute(data: CreateExpenseDTO) { return expenseService.createExpense(data) } }
export class ListExpensesByMonthUseCase { execute(userId: string, monthId: string) { return expenseService.findExpensesByUserAndMonth(userId, monthId) } }
export class GetExpenseByIdUseCase { execute(id: string, userId: string) { return expenseService.findExpenseById(id, userId) } }
export class ListExpenseAdjustmentsUseCase { execute(id: string, userId: string) { return expenseService.listExpenseAdjustments(id, userId) } }
export class ListExpenseItemsUseCase { execute(id: string, userId: string) { return expenseService.listExpenseItems(id, userId) } }
export class CreateExpenseItemUseCase { execute(id: string, data: CreateExpenseItemDTO, userId: string) { return expenseService.createExpenseItem(id, data, userId) } }
export class UpdateExpenseItemUseCase { execute(itemId: string, data: UpdateExpenseItemDTO, userId: string) { return expenseService.updateExpenseItem(itemId, data, userId) } }
export class DeleteExpenseItemUseCase { execute(itemId: string, userId: string) { return expenseService.deleteExpenseItem(itemId, userId) } }
export class UpdateExpenseUseCase { execute(id: string, data: UpdateExpenseDTO, userId: string) { return expenseService.updateExpense(id, data, userId) } }
export class DeleteExpenseUseCase { execute(id: string, userId: string) { return expenseService.deleteExpense(id, userId) } }
export class BulkDeleteExpensesUseCase { execute(data: BulkDeleteExpensesDTO, userId: string) { return expenseService.bulkDeleteExpenses(data, userId) } }
export class BulkMarkExpensesPaidUseCase { execute(data: BulkMarkExpensesPaidDTO, userId: string) { return expenseService.bulkMarkExpensesPaid(data, userId) } }