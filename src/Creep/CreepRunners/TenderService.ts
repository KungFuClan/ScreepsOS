import { ICreepRunner } from "Creep/interfaces/interfaces";

export const TenderService: ICreepRunner = {
    *run (creepName: string): Generator {
        yield creepName;
    }
}
