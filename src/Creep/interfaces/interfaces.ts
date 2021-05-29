import { SpawningOptions } from "Spawn/interfaces";

export type ICreepRunner = {
    runRole: (creepName: string) => Generator;
};

export type ICreepBuilder = {
    runBuilder: (roomName: string, spawnOptions: SpawningOptions) => Generator;
}
