import { SpawnQueueHelper } from "./SpawnQueueHelper";
import {SpawningOptions} from "../interfaces";
import { Thread } from "OperatingSystem/thread";
import { spawn } from "child_process";

export type runRoomParams = { roomName: string };



export function * runRoomSpawnQueue(this: Thread<runRoomParams>, roomName: string): Generator<unknown, any, unknown> {
    while(true) {




       yield `SpawnQueue_${roomName} did not submit spawn request.`;

    }
}

function numMinersToQueue(roomName: string, spawnOptions: SpawningOptions) {

        const numWorkPartsNeeded = SpawnQueueHelper.WorkPartsNeededForMining(roomName) - SpawnQueueHelper.GetExistingMinerWorkParts(roomName);

        const remainingCapacity = Game.rooms[roomName].energyCapacityAvailable;



}
