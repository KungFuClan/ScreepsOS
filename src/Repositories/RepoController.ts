/* eslint-disable prefer-const */
import { IController } from "common/interfaces";
import { StructureRepo } from "./StructureRepo";
import { Thread } from "OperatingSystem/thread";
import { kernel } from "OperatingSystem/kernel";
import { sleep } from "OperatingSystem/loopScheduler";

export type restartRepoParams = { sleepTime: number }

export let structureRepo = new StructureRepo();

kernel.createProcess('repoController', runMain, {instance: this});

function * runMain(this: Thread): Generator {

    while(true) {
        // ! We cannot access restartRepo without having an instance of the class or it being a static method
        if(!this.process.hasThread('RestartStructureRepo')) {
            kernel.createThread<restartRepoParams>('repoController', 'RestartStructureRepo', restartRepo, {sleepTime: 5});
        }

        yield * sleep(5);

    }

}

function * restartRepo(this: Thread, sleepTime: number): Generator {

    while(true) {

        yield * sleep(sleepTime);

        structureRepo = new StructureRepo();

    }
}
