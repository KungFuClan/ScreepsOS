/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-namespace */

import "importProcesses";
import "OperatingSystem/SafeObject";

import { ErrorMapper } from "utils/ErrorMapper";
import { RoleConstants } from "Creep/interfaces/CreepConstants";
import { SerializedSpawnQueueObject } from "Spawn/interfaces";
import { TravelData } from "Pathfinding/Traveler_Types";
import { kernel } from "OperatingSystem/kernel";

declare global {
  interface Memory {
    uuid: number;
    log: any;
    spawnQueue: SerializedSpawnQueueObject[]
  }

  interface CreepMemory {
    role: RoleConstants;
    homeRoom: string;
    targetRoom: string;
    working: boolean;
    target?: Id<RoomObject>;
    _trav?: Partial<TravelData>;
  }

  interface RoomObject {
    safe: <T extends RoomObject>() => T;
    id: Id<this>;
  }

  interface RoomMemory {
    avoid?: number;
  }
}

export const loop = ErrorMapper.wrapLoop(() => {

  //* Just call this once per tick, iterates through the entire queue based on this. Can also create multiple queues and multiple runs if needed.
  kernel.tick();

});
