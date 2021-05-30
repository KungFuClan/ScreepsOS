import { BodyDefinition } from "Spawn/BodyParts";
import { SpawningOptions } from "Spawn/interfaces";
import { StringMap } from "common/interfaces";

export type ICreepRunner = {
    runRole: (creepName: string, cache: StringMap<any>) => Generator;
};

export type ICreepBuilder = {
    runBuilder: (roomName: string, spawnOptions: SpawningOptions) => BodyDefinition;
}

export interface IRunCreepParams {
    creepName: string
};
