import { ICreepRunner } from "Creep/interfaces/interfaces";

export const DeckhandService: ICreepRunner = {
    *run (creepName: string): Generator {
        yield creepName;
    }
}
