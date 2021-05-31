import { StructureRepo, structureRepo } from "Repositories/StructureRepo";

import { CommonCreepHelper } from "common/Helpers/Common_CreepHelper";
import { CommonRoomHelper } from "common/Helpers/Common_RoomHelper";
import { CreepRepo } from "Repositories/CreepRepo";
import { EnergyTier } from "Spawn/interfaces";
import { RoleConstants } from "Creep/interfaces/CreepConstants";
import { RoomRepo } from "Repositories/RoomRepo";
import { spawnQueue } from "./SpawnQueue";

export class SpawnQueueHelper {

    public static GetExistingRoleParts(roomName: string, role: RoleConstants, part: BodyPartConstant): number {

        const creeps = CreepRepo.GetCreeps_My_ByRoom_ByRoles(roomName, [role]);

        const totalPartCount = _.sum(creeps, creep => CommonCreepHelper.PartCount(creep, part));

        return totalPartCount;

    }


    public static GetQueuedRoleParts(roomName: string, role: RoleConstants, part: BodyPartConstant): number {

        let targetPartCount = 0;

        for(const request of spawnQueue) {

            if(request.requestingRoom !== roomName) {
                continue;
            }

            if(request.role !== role) {
                continue;
            }

            targetPartCount += CommonCreepHelper.BodyPartCount(request.body, part);
        }

        return targetPartCount;

    }

    public static WorkPartsNeededForMining(roomName: string, capacity = 1.0): number {

        const sources = RoomRepo.GetAllSources_ByRoom(roomName);

        let workPartsNeeded = 0;

        if(CommonRoomHelper.getEnergyTier(roomName) === EnergyTier.T1) {

            for(const source of sources) {

                const openTiles = CommonRoomHelper.GetNumOpenTiles(source.pos);

                const minPartsNeeded = Math.ceil((source.energyCapacity / HARVEST_POWER) / 300);

                // Can only afford 2 work parts at this level
                const creepsNeeded = Math.ceil(minPartsNeeded / 2)
                workPartsNeeded += 2 * Math.min(openTiles, creepsNeeded)
            }

        } else {
            const totalSourceEnergyCapacity = _.sum(sources, source => source.energyCapacity);
            workPartsNeeded = Math.ceil((totalSourceEnergyCapacity / HARVEST_POWER) / 300);
        }


        return workPartsNeeded * capacity;

    }

    public static CarryPartsNeededForTender(roomName: string, capacity = 1.0): number {

        const sources = RoomRepo.GetAllSources_ByRoom(roomName);
        const room = Game.rooms[roomName];
        const returnPoints: Structure[] = []; // Places in the room we will return the energy to

        if(room.storage) returnPoints.push(room.storage);
        if(room.terminal) returnPoints.push(room.terminal);

        if(returnPoints.length === 0) {
            const spawns = structureRepo.getStructure_My<StructureSpawn>(STRUCTURE_SPAWN, roomName);
            _.forEach(spawns, spawn => returnPoints.push(spawn));
        }

        let carryPartsNeeded = 0;

        for(const source of sources) {

            const averageDistToSource = _.sum(returnPoints, rp => rp.pos.getRangeTo(source));

            const tripsPerCycle = 300 / (averageDistToSource * 2);

            carryPartsNeeded += source.energyCapacity / tripsPerCycle / 50;

        }

        return carryPartsNeeded * capacity;
    }
}

