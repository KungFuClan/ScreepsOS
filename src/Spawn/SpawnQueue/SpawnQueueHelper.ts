import { CommonCreepHelper } from "common/Helpers/Common_CreepHelper";
import { CreepRepo } from "Repositories/CreepRepo";
import { RoleConstants } from "Creep/interfaces/CreepConstants";
import { RoomRepo } from "Repositories/RoomRepo";

export class SpawnQueueHelper {

    public static GetExistingMinerWorkParts(roomName: string): number {

        const miners = CreepRepo.GetCreeps_My_ByRoom_ByRoles(roomName, [RoleConstants.MINER]);

        const workParts = _.sum(miners, miner => CommonCreepHelper.PartCount(miner, WORK));

        return workParts;

    }

    public static WorkPartsNeededForMining(roomName: string, capacity = 1.0): number {

        const sources = RoomRepo.GetAllSources_ByRoom(roomName);
        const totalSourceEnergyCapacity = _.sum(sources, source => source.energyCapacity);

        const workPartsNeeded = Math.ceil((totalSourceEnergyCapacity / HARVEST_POWER) / 300);

        return workPartsNeeded * capacity;

    }


}

