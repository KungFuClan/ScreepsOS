import { StructureRepo } from "./StructureRepo";
import { Thread } from "OperatingSystem/thread";
import { kernel } from "OperatingSystem/kernel";
import { sleep } from "OperatingSystem/loopScheduler";
import { StringMap } from "common/interfaces";
import { Logger } from "utils/Logger";

type _hasConstructor = new (...args: any[]) => any;

type ResetRepositoryParams = {
    sleepTime: number
};

kernel.createProcess('RepositoryController', runRepositoryController, {});

const logger = new Logger('[RepositoryController]');

export const Repos = {
    structures: new StructureRepo(),
}

function * runRepositoryController(this: Thread): Generator {

    while(true) {
        if(!this.hasThread('StructureRepoReset')){
            this.createThread<ResetRepositoryParams>('StructureRepoReset', resetStructureRepo, { sleepTime: 5 });
        }

        yield * sleep(10);
    }
}

function * resetStructureRepo(this: Thread, sleepTime: number): Generator {
    while(true) {

        yield * sleep(sleepTime);

        Repos.structures = new StructureRepo();

        logger.info('StructureRepo reset.');
    }
}
