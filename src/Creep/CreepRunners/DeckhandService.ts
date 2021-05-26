import { ICreepRunner } from "Creep/interfaces/interfaces";

export const DeckhandService: ICreepRunner = {
    *runRole (creepName: string): Generator {
        yield creepName;
    }
}
