import { ActionConstants } from "Creep/interfaces/CreepConstants";
import { BodyArrayModifier } from "Spawn/BodyParts";
import { InvalidActionTargetError } from "common/errors";
import { PathfindingHelper } from "Pathfinding/PathfindingHelper";
import { RoomRepo } from "Repositories/RoomRepo";

const StoreStructures = StructureExtension
|| StructureFactory
|| StructureLab
|| StructureLink
|| StructureNuker
|| StructurePowerSpawn
|| StructureSpawn
|| StructureStorage
|| StructureTerminal
|| StructureTower
|| StructureContainer;


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

    public static PerformAction(creep: Creep, action: ActionConstants, target: RoomObject): ScreepsReturnCode {

        switch(action) {
            case ActionConstants.BUILD:

                if(target instanceof ConstructionSite) {
                    return creep.build(target);
                }
                throw new InvalidActionTargetError('Construction Site', target, action);

            case ActionConstants.REPAIR:
                if(target instanceof Structure) {
                    return creep.repair(target);
                }
                throw new InvalidActionTargetError('Structure', target, action);

            case ActionConstants.FILL:
                if(target instanceof StoreStructures) {
                    return creep.transfer(target, RESOURCE_ENERGY); // TODO fix this into multiple methods, one for energy and one for specialized or some simliar thing
                }
                throw new InvalidActionTargetError('StoreStructure', target, action);

            case ActionConstants.RETRIEVE:
                if(target instanceof Resource) {
                    return creep.pickup(target);
                }
                if(target instanceof StoreStructures || Ruin || Tombstone) {
                    return creep.withdraw(target as StructureStorage, RESOURCE_ENERGY);
                }
                throw new InvalidActionTargetError('StoreStructure', target, action);

            case ActionConstants.UPGRADE:
                if(target instanceof StructureController) {
                    return creep.upgradeController(target);
                }
                throw new InvalidActionTargetError('StructureController', target, action);

            default:
                throw new Error(`Unhandled action in PerformAction. ${action}, ${JSON.stringify(target)}`);
        }
    }
}


