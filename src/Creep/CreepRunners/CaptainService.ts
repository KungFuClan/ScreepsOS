import { ICreepRunner } from "Creep/interfaces/interfaces";

export const CaptainService: ICreepRunner = {
    *runRole (creepName: string): Generator {
        yield creepName;
    }
}
