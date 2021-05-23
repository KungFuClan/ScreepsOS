import { Thread } from "OperatingSystem/thread";
import { kernel } from 'OperatingSystem/kernel';
import { CreepRepo } from "Repositories/CreepRepo";
import { run as CreepRunner } from "Creep/CreepService";

interface runCreepParams {
    creepName: string
};

const processName = 'creepController'

kernel.createProcess(processName, runMain, {});

function * runMain(this: Thread<any>): Generator<unknown,any,unknown>  {
    while(true) {
        const creeps = CreepRepo.getAllCreeps_My_Civ();
        for(const creep of creeps){
            if(!this.process.hasThread(creep.name)) {
                this.process.createThread<runCreepParams>(`creepManager_${creep.name}`, CreepRunner, {creepName: creep.name});
            }
        }

        yield "Running Creeps Completed";
    }
}
