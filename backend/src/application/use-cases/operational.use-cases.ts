import { OperationalService } from "../../services/operational.service";

const operationalService = new OperationalService();

export class GetLivenessUseCase {
  execute() {
    return operationalService.getLiveness();
  }
}
export class GetReadinessUseCase {
  execute() {
    return operationalService.getReadiness();
  }
}
export class GetHealthUseCase {
  execute() {
    return operationalService.getHealth();
  }
}
