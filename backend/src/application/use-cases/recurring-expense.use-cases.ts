import type {
  CreateRecurringExpenseDTO,
  RestoreRecurringExpenseOccurrenceDTO,
  UpdateRecurringExpenseDTO,
} from "../../dtos/recurring-expense.dto";
import { RecurringExpenseService } from "../../services/recurring-expense.service";

const recurringExpenseService = new RecurringExpenseService();

export class CreateRecurringExpenseUseCase {
  execute(data: CreateRecurringExpenseDTO, userId: string) {
    return recurringExpenseService.createRecurringExpense(data, userId);
  }
}
export class ListRecurringExpensesUseCase {
  execute(userId: string) {
    return recurringExpenseService.listRecurringExpensesByUser(userId);
  }
}
export class GetRecurringExpenseByIdUseCase {
  execute(id: string, userId: string) {
    return recurringExpenseService.findRecurringExpenseById(id, userId);
  }
}
export class UpdateRecurringExpenseUseCase {
  execute(id: string, data: UpdateRecurringExpenseDTO, userId: string) {
    return recurringExpenseService.updateRecurringExpense(id, data, userId);
  }
}
export class RestoreRecurringExpenseOccurrenceUseCase {
  execute(
    id: string,
    data: RestoreRecurringExpenseOccurrenceDTO,
    userId: string,
  ) {
    return recurringExpenseService.restoreRecurringExpenseOccurrence(
      id,
      data.month_id,
      userId,
    );
  }
}
export class ListRecurringExpenseEntriesUseCase {
  execute(id: string, userId: string) {
    return recurringExpenseService.findExpensesByRecurringExpense(id, userId);
  }
}
export class DeleteRecurringExpenseUseCase {
  execute(
    id: string,
    data: UpdateRecurringExpenseDTO | undefined,
    userId: string,
  ) {
    return recurringExpenseService.deleteRecurringExpense(id, data, userId);
  }
}
