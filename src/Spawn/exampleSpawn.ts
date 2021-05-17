/* eslint-disable max-classes-per-file */
import { Process } from "OperatingSystem/process"
import { kernel } from "OperatingSystem/kernel"
import { sleep } from "OperatingSystem/loopScheduler";
import { GeneratorCreator, StringMap } from "common/interfaces";
import { spawn } from "child_process";

export class BuilderSpawnService {

    public static * create(): Generator<unknown, any, unknown> {

        //* Calculate Body Here
        const body = ["work", "work", "move"];
        yield; // pause after body calcs

        //* do some other work here like checking energy availability or something
        const something = "something";
        yield;

        // * Somehow claim/find a spawn
        // let openSpawn = yield * findOpenSpawn();
        let openSpawn = "example";

        while(openSpawn === undefined) {
            yield * sleep(3);

            openSpawn = "trying again, might still be undefined";
        }

        const energyAvailable = yield * awaitEnergyAvailable(100);

        // * spawn.spawn(jkfld;asjfdsa);
        // * while(spawn.spawning === true)
        // *    yield * sleep(3);
        // * }
        // * return true

    }



}


export class ExampleSpawnController {

    private creepSpawnMethod: StringMap<GeneratorCreator> =
        { 'builder': BuilderSpawnService.create,
       // 'worker': WorkerSpawn.create
        };

    private processName = "runSpawn";

    public createProcess(): void {


        if(!kernel.hasProcess(this.processName)) {
            //* Create the main thread
            kernel.createProcess(this.processName, this.run, []);

            //* If there is a thread we are guaranteed to want each time we can add this here too
            kernel.createThread(this.processName, 'newThreadName', function * () { yield * [1,2,3] }, []);
        }

    }

    private * run(): Generator<unknown, any, unknown> {
        while(true) {

            const spawnQueue = this.getSpawnQueue();

            if(spawnQueue.length === 0) {
                yield * sleep(5);
                continue;
            }

            if(kernel.hasThread(`${this.processName}:spawn_RoomName`)) {
                yield * sleep(5);
                continue;
            }

            const nextRole = spawnQueue.pop();

            // * Create new thread responsible for creating this role
            kernel.createThread(this.processName, `spawn_RoomName`, this.creepSpawnMethod[nextRole!])
            yield; // return control  once we create a new thread

            // * after control is given to us again just restart looking for next loop (or whatever needs done between spawns);
        }
    }

    private getSpawnQueue(): string[] {
        return [];
    }



}

export const runSpawns = new ExampleSpawnController();
