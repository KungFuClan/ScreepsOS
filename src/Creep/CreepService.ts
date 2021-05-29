import { CreepRunners } from "./CreepRunners/RunnerConstants";
import { IRunCreepParams } from "./interfaces/interfaces";
import { Logger } from "utils/Logger";
import { Thread } from "OperatingSystem/thread";
import { ThreadState } from "OperatingSystem/interfaces";

const _logger = new Logger("CreepService");

export function * runCreep (this: Thread<IRunCreepParams> , creepName: string): Generator<unknown, any, unknown> {
    while(Game.creeps[creepName]) {
        const creep = Game.creeps[creepName];

        if(creep === undefined) {
            _logger.warn(`${creepName} could not be found on CreepService.run`);
            return;
        }

        while(creep.spawning) {
            yield ThreadState.SUSPEND;
        }

        if(!this.process.hasThread(`$roleService_${creepName}`)) {
            this.process.createThread(`roleService_${creepName}`, CreepRunners[creep.safe<Creep>().memory.role].runRole, {});
        }
    }
}
