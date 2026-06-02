import { DeleteMonthlyIncomeUseCase } from "../../../../application/use-cases/monthly-income/delete.use-case";
import { GetMonthlyIncomeByIdUseCase } from "../../../../application/use-cases/monthly-income/get-by-id.use-case";
import { ListMonthlyIncomesByMonthUseCase } from "../../../../application/use-cases/monthly-income/list-by-month.use-case";
import { RegisterMonthlyIncomeUseCase } from "../../../../application/use-cases/monthly-income/register.use-case";
import { UpdateMonthlyIncomeUseCase } from "../../../../application/use-cases/monthly-income/update.use-case";
import { MonthRepository } from "../../../../repositories/month.repository";
import { MonthlyIncomeRepository } from "../../../../repositories/monthly-income.repository";
import { IncomeTaxRepository } from "../../../../repositories/income-tax.repository";
import { UserRepository } from "../../../../repositories/user.repository";
import { IncomeTaxationService } from "../../../../services/income-taxation.service";
import { DeleteMonthlyIncomeController } from "./delete.controller";
import { GetMonthlyIncomeByIdController } from "./get-by-id.controller";
import { ListMonthlyIncomesByMonthController } from "./list-by-month.controller";
import { RegisterMonthlyIncomeController } from "./register.controller";
import { UpdateMonthlyIncomeController } from "./update.controller";

const monthlyIncomeRepository = new MonthlyIncomeRepository();
const monthRepository = new MonthRepository();
const userRepository = new UserRepository();
const incomeTaxRepository = new IncomeTaxRepository();
const incomeTaxationService = new IncomeTaxationService();

export const monthlyIncomeComposer = {
  register: new RegisterMonthlyIncomeController(
    new RegisterMonthlyIncomeUseCase(
      monthlyIncomeRepository,
      monthRepository,
      userRepository,
      incomeTaxRepository,
      incomeTaxationService,
    ),
  ),
  listByMonth: new ListMonthlyIncomesByMonthController(
    new ListMonthlyIncomesByMonthUseCase(monthlyIncomeRepository, monthRepository),
  ),
  getById: new GetMonthlyIncomeByIdController(
    new GetMonthlyIncomeByIdUseCase(monthlyIncomeRepository),
  ),
  update: new UpdateMonthlyIncomeController(
    new UpdateMonthlyIncomeUseCase(
      monthlyIncomeRepository,
      incomeTaxRepository,
      incomeTaxationService,
    ),
  ),
  delete: new DeleteMonthlyIncomeController(
    new DeleteMonthlyIncomeUseCase(monthlyIncomeRepository),
  ),
};
