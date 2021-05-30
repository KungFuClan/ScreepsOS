import { BodyDefinition } from "Spawn/BodyParts";
import { ICreepBuilder } from "Creep/interfaces/interfaces";
import { SpawningOptions } from "Spawn/interfaces";

export const TenderBuilder: ICreepBuilder = {
    runBuilder(roomname: string, spawnOptions: SpawningOptions): BodyDefinition {

        return {};
    }
}
