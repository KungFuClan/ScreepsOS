import { CreepRepo } from "Repositories/CreepRepo";
import { ICreepRunner } from "Creep/interfaces/interfaces";
import { RoomRepo } from "Repositories/RoomRepo";
import { StringMap } from "common/interfaces";
import { ThreadState } from "OperatingSystem/interfaces";
import { fill } from "lodash";

export const TenderService: ICreepRunner = {


    *runRole (creepName: string): Generator {

        const EnergyTarget = "energyTarget";
        const StoreTarget = "storeTarget";
        const cache: StringMap<RoomObject | null> = {}

        while(Game.creeps[creepName]) {

            const creep = Game.creeps[creepName].safe<Creep>();

            const working = CreepRepo.GetCreepWorkingStatus(creep);
            const energyLevel = creep.store.getUsedCapacity();
            if(working && energyLevel === 0) {
                CreepRepo.SetCreepWorkingStatus(creep, false);
            }
            if(!working && energyLevel > 0) {
                CreepRepo.SetCreepWorkingStatus(creep, true);
            }

            if(working) {

                if(!cache[StoreTarget]) {

                    const fillStructs = RoomRepo.GetStructuresNeedingFilled_ByRoom(creep.room.name);

                    if(fillStructs.length === 0) {
                        yield ThreadState.SUSPEND;
                        continue;
                    }

                    const closestStruct = creep.pos.findClosestByRange(fillStructs);

                    if(!closestStruct) {
                        yield ThreadState.SUSPEND;
                        continue;
                    }

                    cache[StoreTarget] = closestStruct;

                }

                const target: AnyStoreStructure = cache[StoreTarget]!.safe();

                const range = creep.pos.getRangeTo(target);
                if(range === 1) {
                    if((target as StructureSpawn).store.getFreeCapacity()! > 0) {
                        creep.transfer(target, RESOURCE_ENERGY);
                    } else {
                        creep.drop(RESOURCE_ENERGY);
                    }
                    yield ThreadState.SUSPEND;
                    continue;
                }

                creep.moveTo(target, {
                    ignoreCreeps: false,
                    visualizePathStyle: { lineStyle: "dashed", opacity: .5}
                });

                yield ThreadState.SUSPEND;
                continue;

                // find storage/spawn
                // if near
                    // deposit/drop on ground
                // if not
                    // move to it
            }
            else {

                // * Get Energy target loop
                if(!cache[EnergyTarget]) {

                    const acceptableEnergyDrops = RoomRepo.GetAllDroppedResources_ByRoom(creep.room.name, RESOURCE_ENERGY).filter(drop => drop.amount >= creep.store.getFreeCapacity());

                    if(acceptableEnergyDrops.length === 0) {
                        yield ThreadState.SUSPEND;
                        continue;
                    }

                    const closestEnergyToPickup = creep.pos.findClosestByRange(acceptableEnergyDrops);

                    if(!closestEnergyToPickup){
                        yield ThreadState.SUSPEND;
                        continue;
                    }

                    cache[EnergyTarget] = closestEnergyToPickup
                }

                const target = cache[EnergyTarget]!.safe();

                const range = creep.pos.getRangeTo(target);
                if(range === 1) {
                    creep.pickup(target as Resource)
                    continue;
                }

                creep.moveTo(target, {
                    ignoreCreeps: false,
                    visualizePathStyle: { lineStyle: "dashed", opacity: .25}
                });
                yield ThreadState.SUSPEND;
                continue;

            }
                // find the mining container to fill from
                // if near
                    // get energy from it
                // if not
                    // move to it
        }


        yield ThreadState.SUSPEND;
    }
}
