import { Thread } from "OperatingSystem/thread";
import { structureRepo } from "Repositories/StructureRepo";

export function * run (this: Thread<{creepName: string}> , creepName: string): Generator<unknown, any, unknown> {
    while(true) {

        const creep = Game.creeps[creepName];
        if(creep === undefined) {
            yield "Run Creeps could not find creep " + creepName + ", destroying thread.";
            return;
        }

        creep.safe<Creep>().say("Testing");
        // todo, pass in correct instance of creep runner to this method
        // todo, find way to refresh creep reference if thread goes into next tick

        yield `${creepName} Creep thread run`;
    }

}
