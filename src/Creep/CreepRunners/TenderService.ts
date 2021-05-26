import { ICreepRunner } from "Creep/interfaces/interfaces";

export const TenderService: ICreepRunner = {
    *runRole (creepName: string): Generator {
        yield creepName;
    }
}
