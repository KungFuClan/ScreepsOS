import { ICreepRunner, IRunCreepParams } from "Creep/interfaces/interfaces";

import { CreepRepo } from "Repositories/CreepRepo";
import { Logger } from "utils/Logger";
import { MinerHelper } from "Creep/Helpers/MinerHelper";
import { RoomRepo } from "Repositories/RoomRepo";
import { StringMap } from "common/interfaces";
import { Thread } from "OperatingSystem/thread";
import { ThreadState } from "OperatingSystem/interfaces";

const MiningContainer = "miningContainer";
const _logger = new Logger("MinerService");

export const MinerService: ICreepRunner = {
    *runRole (this: Thread<IRunCreepParams>, creepName: string): Generator {

        const cache: StringMap<any> = {}
        _logger.info("Cache created");

        while(Game.creeps[creepName]) {
            _logger.debug("Entering miner logic");
            const creep = Game.creeps[creepName];
            let targetSource = CreepRepo.GetCreepMemoryTarget<Source>(creep);
            if(!targetSource) {
                const sources = RoomRepo.GetAllSources_ByRoom(creep.room.name);
                targetSource = MinerHelper.GetSourceWithLowestWorkSaturation(sources, creep.room.name);
                CreepRepo.SetCreepMemoryTarget(creep, targetSource.id);
            }

            if(!cache[MiningContainer]){
                cache[MiningContainer] = cache[MiningContainer] ?  cache[MiningContainer] : MinerHelper.GetMiningContainer(targetSource);
            }

            const miningContainer = cache[MiningContainer];
            let range: number;
            let moveTarget: RoomObject;

            if(miningContainer !== null) {
                range = 0;
                moveTarget = miningContainer;
            }
            else {
                range = 1;
                moveTarget = targetSource;
            }

            const working = CreepRepo.GetCreepWorkingStatus(creep);
            const inRangeOfMoveTarget = creep.pos.inRangeTo(moveTarget.pos, range);
            if(!working && inRangeOfMoveTarget) {
                CreepRepo.SetCreepWorkingStatus(creep, true);
            }
            if(working && !inRangeOfMoveTarget) {
                CreepRepo.SetCreepWorkingStatus(creep, false);
            }

            if(working) {
                creep.harvest(targetSource);
            }
            else {
                creep.moveTo(moveTarget);
            }

            yield ThreadState.SUSPEND;
        }
    }
}
