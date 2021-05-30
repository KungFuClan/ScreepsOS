import { BodyArrayModifier, BodyArrayStyle, BodyPartsUtil } from "Spawn/BodyParts";
import { SpawnQueueObject, spawnQueue } from "./SpawnQueue";

import { Logger } from "utils/Logger";
import { MinerBuilder } from "Creep/CreepBuilders/MinerBuilderService";
import { RoleConstants } from "Creep/interfaces/CreepConstants";
import { SpawnQueueHelper } from "./SpawnQueueHelper";
import {SpawningOptions} from "../interfaces";
import { Thread } from "OperatingSystem/thread";
import { ThreadState } from "OperatingSystem/interfaces";

export type runRoomParams = { roomName: string };



export function * runRoomSpawnQueue(this: Thread<runRoomParams>, roomName: string): Generator<unknown, any, unknown> {
    while(true) {


        queueMiners(roomName);
        yield ThreadState.RESUME;


        yield ThreadState.SUSPEND;

    }
}

function queueMiners(roomName: string, spawnOptions: SpawningOptions = {}) {

        const workPartsNeeded: number = SpawnQueueHelper.WorkPartsNeededForMining(roomName) - SpawnQueueHelper.GetExistingRoleParts(roomName, RoleConstants.MINER, WORK) - SpawnQueueHelper.GetQueuedRoleParts(roomName, RoleConstants.MINER, WORK);

        if(workPartsNeeded === 0) {
            return;
        }

        const body = MinerBuilder.runBuilder(roomName, spawnOptions);

        const numCreepsNeeded = Math.ceil(workPartsNeeded / body[WORK]!);

        for(let i = 0; i < numCreepsNeeded; i++) {

            const newSpawn: SpawnQueueObject = {
                body: BodyPartsUtil.getPartsArray(body, BodyArrayStyle.GROUPED, []),
                requestingRoom: roomName,
                role: RoleConstants.MINER,
                memory: {
                    homeRoom: roomName,
                    targetRoom: roomName,
                    role: RoleConstants.MINER,
                    working: false
                },
                validator: undefined
            }

            // Logger.withPrefix('[RoomSpawn_QueueMiners]').debug("Created creep " + JSON.stringify(newSpawn));

            spawnQueue.unshift(newSpawn);

        }
}
