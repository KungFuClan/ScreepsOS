import { ICreepRunner } from "Creep/interfaces/interfaces";

export const CaptainService: ICreepRunner = {
    *run (creepName: string): Generator {
        yield creepName;
    }
}
