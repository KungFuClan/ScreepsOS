import { CreepRunners } from "Creep/interfaces/CreepConstants";
import { IRunCreepParams } from "./CreepController"
import { Logger } from "utils/Logger";
import { StringMap } from "common/interfaces";
import { Thread } from "OperatingSystem/thread";
import { ThreadState } from "OperatingSystem/interfaces";

const _logger = new Logger("CreepService");

export function * runCreep (this: Thread<IRunCreepParams> , creepName: string): Generator<unknown, any, unknown> {

    const cache: StringMap<any> = {}

    while(Game.creeps[creepName]) {
        const creep = Game.creeps[creepName];

        if(creep === undefined) {
            _logger.warn(`${creepName} could not be found on CreepService.run`);
            return;
        }

        while(creep.spawning) {
            yield ThreadState.SUSPEND;
        }

        yield * CreepRunners[creep.memory.role].runRole(creepName, cache);
    }
}
