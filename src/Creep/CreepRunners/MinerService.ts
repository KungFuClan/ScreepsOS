import { ICreepRunner } from "Creep/interfaces/interfaces";

export const MinerService: ICreepRunner = {
    *run (creepName: string): Generator {
        yield creepName;
    }
}
