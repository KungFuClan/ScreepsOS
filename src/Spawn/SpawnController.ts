import { Controller } from 'common/interfaces';
import { kernel } from 'OperatingSystem/kernel';
import { sleep } from 'OperatingSystem/loopScheduler';

export class SpawnController implements Controller {



    public processName = 'spawnController';

    public createProcess(): void {

        if(!kernel.hasProcess(this.processName)) {
            //* Create the main thread
            kernel.createProcess(this.processName, this.runMain, []);
        }
    }

    public * runMain(): Generator<unknown,any,unknown> {
        while(true) {

            // TODO Get the list of rooms from somewhere
            const ownedRooms = ["W12S14", "E24N13"];

            for(const room of ownedRooms) {
                if(!kernel.hasThread(`${this.processName}:${room}`)){
                    kernel.createThread(this.processName, room, this.runRoom, {roomName: room});
                    yield;
                }
            }

            yield * sleep(10);

        }
    }

    public * runRoom(roomName: string): Generator<unknown,any,unknown> {

        if(Game.rooms[roomName] === undefined) {
            console.log("RunSpawns could not find room " + roomName + ", destroying thread.");
            return;
        }

        while(true) {

            const spawns = Game.rooms[roomName].find(FIND_MY_SPAWNS);

            if(spawns.length <= 0) {
                console.log(`${roomName} does not have any active spawns.`);

            }

            const spawnQueue = getQueueForRoom();

            for(const spawn of spawnQueue) {
                // do something with spawn
                yield;
            }
            // Do stuff
            yield;

        }

    }
}
