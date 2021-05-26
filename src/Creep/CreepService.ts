import { CreepRunners } from "Creep/interfaces/CreepConstants";
import { Logger } from "utils/Logger";
import { Thread } from "OperatingSystem/thread";
import { sleep } from "OperatingSystem/loopScheduler";

const _logger = new Logger("CreepService");

export function * run (this: Thread<{creepName: string}> , creepName: string): Generator<unknown, any, unknown> {
    const creep = Game.creeps[creepName];
    if(creep === undefined) {
        _logger.warn(`${creepName} could not be found on CreepService.run`);
        return;
    }

    if(creep.spawning) {
        const ticksToSpawn = creep.body.length * CREEP_SPAWN_TIME;
        yield * sleep(ticksToSpawn);
    }

    yield * CreepRunners[creep.memory.role].run(creepName);
}
