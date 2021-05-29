import { CreepRepo } from "Repositories/CreepRepo";
import { runCreep as CreepRunner } from "Creep/CreepService";
import { IRunCreepParams } from "./interfaces/interfaces";
import { Logger } from "utils/Logger";
import { Thread } from "OperatingSystem/thread";
import { kernel } from 'OperatingSystem/kernel';

const processName = 'creepController'
const _logger = new Logger("CreepController");

kernel.createProcess(processName, runCreepMain, {});

function * runCreepMain(this: Thread<any>): Generator<unknown,any,unknown>  {
    while(true) {
        const creeps = CreepRepo.GetAllCreeps_My_Civ();
        for(const creep of creeps){
            if(!this.process.hasThread(`creepManager_${creep.name}`)) {
                _logger.info("Created creep thread for " + creep.name);
                this.process.createThread<IRunCreepParams>(`creepManager_${creep.name}`, CreepRunner, {creepName: creep.name});
            }
        }

        yield "Running Creeps Completed";
    }
}
