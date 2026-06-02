import { CreateIncomeTaxUseCase } from "../../../../application/use-cases/income-tax/create.use-case";
import { DeleteIncomeTaxUseCase } from "../../../../application/use-cases/income-tax/delete.use-case";
import { GetIncomeTaxByIdUseCase } from "../../../../application/use-cases/income-tax/get-by-id.use-case";
import { ListIncomeTaxesByIncomeUseCase } from "../../../../application/use-cases/income-tax/list-by-income.use-case";
import { UpdateIncomeTaxUseCase } from "../../../../application/use-cases/income-tax/update.use-case";
import { IncomeTaxRepository } from "../../../../repositories/income-tax.repository";
import { MonthlyIncomeRepository } from "../../../../repositories/monthly-income.repository";
import { CreateIncomeTaxController } from "./create.controller";
import { DeleteIncomeTaxController } from "./delete.controller";
import { GetIncomeTaxByIdController } from "./get-by-id.controller";
import { ListIncomeTaxesByIncomeController } from "./list-by-income.controller";
import { UpdateIncomeTaxController } from "./update.controller";

const incomeTaxRepository = new IncomeTaxRepository();
const monthlyIncomeRepository = new MonthlyIncomeRepository();

export const incomeTaxComposer = {
  create: new CreateIncomeTaxController(
    new CreateIncomeTaxUseCase(incomeTaxRepository, monthlyIncomeRepository),
  ),
  listByIncome: new ListIncomeTaxesByIncomeController(
    new ListIncomeTaxesByIncomeUseCase(
      incomeTaxRepository,
      monthlyIncomeRepository,
    ),
  ),
  getById: new GetIncomeTaxByIdController(
    new GetIncomeTaxByIdUseCase(incomeTaxRepository, monthlyIncomeRepository),
  ),
  update: new UpdateIncomeTaxController(
    new UpdateIncomeTaxUseCase(incomeTaxRepository, monthlyIncomeRepository),
  ),
  delete: new DeleteIncomeTaxController(
    new DeleteIncomeTaxUseCase(incomeTaxRepository, monthlyIncomeRepository),
  ),
};
