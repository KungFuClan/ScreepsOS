import { CreepRepo } from "Repositories/CreepRepo";
import { runCreep as CreepRunner } from "Creep/CreepService";
import { Thread } from "OperatingSystem/thread";
import { kernel } from 'OperatingSystem/kernel';

interface IRunCreepParams {
    creepName: string
};

const processName = 'creepController'

kernel.createProcess(processName, runCreepMain, {});

function * runCreepMain(this: Thread<any>): Generator<unknown,any,unknown>  {
    while(true) {
        const creeps = CreepRepo.GetAllCreeps_My_Civ();
        for(const creep of creeps){
            if(!this.process.hasThread(creep.name)) {
                this.process.createThread<IRunCreepParams>(`creepManager_${creep.name}`, CreepRunner, {creepName: creep.name});
            }
        }

        yield "Running Creeps Completed";
    }
}
