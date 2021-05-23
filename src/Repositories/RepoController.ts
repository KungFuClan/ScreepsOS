import { Logger } from "utils/Logger";
import { Thread } from "OperatingSystem/thread";
import { kernel } from "OperatingSystem/kernel";
import { sleep } from "OperatingSystem/loopScheduler";
import { structureRepo } from "./StructureRepo";

type Repository = { cache: any, name?: string }

type ResetRepositoryParams = {
    sleepTime: number,
    repository: Repository
};

kernel.createProcess('RepositoryController', runRepositoryController, {});

const logger = new Logger('[RepositoryController]');

function * runRepositoryController(this: Thread): Generator {

    while(true) {
        if(!this.hasThread('StructureRepoReset')){
            this.createThread<ResetRepositoryParams>('StructureRepoReset', fullResetCache, { sleepTime: 5, repository: structureRepo });
        }

        yield * sleep(10);
    }
}

function * fullResetCache(this: Thread, sleepTime: number, repository: Repository): Generator {
    while(true) {

        yield * sleep(sleepTime);

        // Repos.structures = new StructureRepo();
        repository.cache = {};

        if(repository.name) {
            logger.info(`${repository.name}: Cache has been reset.`);
        }
    }
}
