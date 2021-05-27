import { CreepRunners } from "Creep/interfaces/CreepConstants";
import { Logger } from "utils/Logger";
import { Thread } from "OperatingSystem/thread";
import { ThreadState } from "OperatingSystem/interfaces";

const _logger = new Logger("CreepService");

export function * runCreep (this: Thread<{creepName: string}> , creepName: string): Generator<unknown, any, unknown> {
    const creep = Game.creeps[creepName];
    if(creep === undefined) {
        _logger.warn(`${creepName} could not be found on CreepService.run`);
        return;
    }

    if(creep.spawning) {
        yield ThreadState.SUSPEND;
    }

    yield * CreepRunners[creep.memory.role].runRole(creepName);
}
