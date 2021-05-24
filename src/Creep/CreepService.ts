import { Thread } from "OperatingSystem/thread";

export function * run (this: Thread<{creepName: string}> , creepName: string): Generator<unknown, any, unknown> {
    while(true) {

        const creep = Game.creeps[creepName];
        if(creep === undefined) {
            yield "Run Creeps could not find creep " + creepName + ", destroying thread.";
            return;
        }

        yield `${creepName} Creep thread run`;
    }

}
