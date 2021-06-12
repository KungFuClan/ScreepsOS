import { BodyArrayStyle, BodyPartsUtil } from "Spawn/BodyParts";
import { SpawnQueueObject, SpawningOptions } from "../interfaces";

import { CreepRepo } from "Repositories/CreepRepo";
import { DeckhandBuilder } from "Creep/CreepBuilders/DeckhandBuilderService";
import { MinerBuilder } from "Creep/CreepBuilders/MinerBuilderService";
import { RoleConstants } from "Creep/interfaces/CreepConstants";
import { SpawnQueueHelper } from "./SpawnQueueHelper";
import { TenderBuilder } from "Creep/CreepBuilders/TenderBuilderService";
import { Thread } from "OperatingSystem/thread";
import { ThreadState } from "OperatingSystem/interfaces";
import { spawnQueue } from "./SpawnQueue";

export type runRoomParams = { roomName: string };



export function * runRoomSpawnQueue(this: Thread<runRoomParams>, roomName: string): Generator<unknown, any, unknown> {
    while(true) {


        queueMiners(roomName); yield ThreadState.RESUME;

        queueTenders(roomName); yield ThreadState.RESUME;

        queueDeckhands(roomName); yield ThreadState.RESUME;

        yield ThreadState.SUSPEND;

    }
}

function queueMiners(roomName: string, spawnOptions: SpawningOptions = {}): void {

        const workPartsNeeded: number = SpawnQueueHelper.WorkPartsNeededForMining(roomName) - SpawnQueueHelper.GetExistingRoleParts(roomName, RoleConstants.MINER, WORK) - SpawnQueueHelper.GetQueuedRoleParts(roomName, RoleConstants.MINER, WORK);

        if(workPartsNeeded === 0) {
            return;
        }

        const bodyDefinition = MinerBuilder.runBuilder(roomName, spawnOptions);

        const numCreepsNeeded = Math.ceil(workPartsNeeded / bodyDefinition[WORK]!);

        let priority = CreepRepo.GetCreeps_My_ByRoles([RoleConstants.MINER]).length > 0 ? spawnOptions.priority || 2 : 1;
        const body = BodyPartsUtil.getPartsArray(bodyDefinition, BodyArrayStyle.GROUPED, []);

        for(let i = 0; i < numCreepsNeeded; i++) {

            const newSpawn: SpawnQueueObject = {
                body,
                requestingRoom: roomName,
                role: RoleConstants.MINER,
                memory: {
                    homeRoom: roomName,
                    targetRoom: roomName,
                    role: RoleConstants.MINER,
                    working: false
                },
                priority,
                validator: undefined
            }

            // Logger.withPrefix('[RoomSpawn_QueueMiners]').debug("Created creep " + JSON.stringify(newSpawn));

            spawnQueue.unshift(newSpawn);

            priority = spawnOptions.priority || 2; // So that only the first of the creeps will be priority 1, unless specified

        }
}

function queueTenders(roomName: string, spawnOptions: SpawningOptions = {}): void {

    const carryPartsNeeded: number = SpawnQueueHelper.CarryPartsNeededForTender(roomName) - SpawnQueueHelper.GetExistingRoleParts(roomName, RoleConstants.TENDER, CARRY) - SpawnQueueHelper.GetQueuedRoleParts(roomName, RoleConstants.TENDER, CARRY);

    if(carryPartsNeeded === 0) {
        return;
    }

    const bodyDefinition = TenderBuilder.runBuilder(roomName, spawnOptions);

    const numCreepsNeeded = Math.ceil(carryPartsNeeded / bodyDefinition[CARRY]!);

    let priority = CreepRepo.GetCreeps_My_ByRoles([RoleConstants.TENDER]).length > 0 ? spawnOptions.priority || 2 : 1;
    const body = BodyPartsUtil.getPartsArray(bodyDefinition, BodyArrayStyle.GROUPED, []);

    for(let i = 0; i < numCreepsNeeded; i++) {

        const newSpawn: SpawnQueueObject = {
            body,
            requestingRoom: roomName,
            role: RoleConstants.TENDER,
            memory: {
                homeRoom: roomName,
                targetRoom: roomName,
                role: RoleConstants.TENDER,
                working: false
            },
            priority,
            validator: undefined
        }

        // Logger.withPrefix('[RoomSpawn_QueueMiners]').debug("Created creep " + JSON.stringify(newSpawn));

        spawnQueue.unshift(newSpawn);

        priority = spawnOptions.priority || 2; // So that only the first of the creeps will be priority 1 ever

    }
}

function queueDeckhands(roomName: string, spawnOptions: SpawningOptions = {}): void {

    // TODO How do we want to target controller upgrade % / builders needed
    const workPartsNeeded = 10 - SpawnQueueHelper.GetExistingRoleParts(roomName, RoleConstants.DECKHAND, WORK) - SpawnQueueHelper.GetQueuedRoleParts(roomName, RoleConstants.DECKHAND, WORK);

    if(workPartsNeeded === 0) {
        return;
    }

    const bodyDefinition = DeckhandBuilder.runBuilder(roomName, spawnOptions);

    const numCreepsNeeded = Math.ceil(workPartsNeeded / bodyDefinition[WORK]!);

    let priority = CreepRepo.GetCreeps_My_ByRoles([RoleConstants.DECKHAND]).length > 0 ? spawnOptions.priority || 2 : 1;

    const body = BodyPartsUtil.getPartsArray(bodyDefinition, BodyArrayStyle.COLLATED, []);

    for(let i = 0; i < numCreepsNeeded; i++) {
        const newSpawn: SpawnQueueObject = {
            body,
            requestingRoom: roomName,
            role: RoleConstants.DECKHAND,
            memory: {
                homeRoom: roomName,
                targetRoom: roomName,
                role: RoleConstants.DECKHAND,
                working: false
            },
            priority,
            validator: undefined
        }

        spawnQueue.unshift(newSpawn);

        priority = spawnOptions.priority || 2;
    }
}
