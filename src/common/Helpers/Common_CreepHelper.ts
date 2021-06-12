import { BodyArrayModifier } from "Spawn/BodyParts";
import { PathfindingHelper } from "Pathfinding/PathfindingHelper";
import { RoomRepo } from "Repositories/RoomRepo";

export class CommonCreepHelper {

    public static PartCount(creep: Creep, partToCount: BodyPartConstant): number {

        let partCount = 0;

        for(const part of creep.body) {
            if(part.type === partToCount) {
                partCount++
            }
        }

        return partCount;

    }

    public static BodyPartCount(body: BodyPartConstant[], partToCount: BodyPartConstant): number {

        let partCount = 0;

        for(const part of body) {
            if(part === partToCount) {
                partCount++
            }
        }

        return partCount;

    }

    public static getClosestEnergyTarget(creep: Creep): Resource<RESOURCE_ENERGY> | undefined {
        const acceptableEnergyDrops = RoomRepo.GetAllDroppedResources_ByRoom(creep.room.name, RESOURCE_ENERGY).filter(drop => drop.amount >= creep.store.getFreeCapacity());

        if(acceptableEnergyDrops.length === 0) {
            return;
        }

        const closestEnergyToPickup = creep.pos.findClosestByRange(acceptableEnergyDrops);

        if(!closestEnergyToPickup){
            return;
        }

        return closestEnergyToPickup
    }

    public static getClosestTargetToFill(creep: Creep): Structure | undefined{
        const fillStructs = RoomRepo.GetStructuresNeedingFilled_ByRoom(creep.room.name);

        if(fillStructs.length === 0) {
            return;
        }

        const closestStruct = creep.pos.findClosestByRange(fillStructs);

        if(!closestStruct) {
            return;
        }

        return closestStruct;
    }

    public static MoveTo(creep: Creep, target: _HasRoomPosition, targetRange = 0): boolean {

        const range = creep.pos.getRangeTo(target);
        if(range <= targetRange) {
            return false;
        }

        const opts = PathfindingHelper.GetDefaultMoveOpts(creep)
        opts.range = targetRange;

        if(target.pos.roomName === creep.pos.roomName) {
            opts.maxRooms = 1;
        }

        // creep.moveTo(target,
        //     opts
        //     );

        creep.travelTo(target, opts);

        return true;
    }
}

