import { IService } from "common/interfaces";
import { Thread } from "OperatingSystem/thread";
import { sleep } from "OperatingSystem/loopScheduler";

export class RoomSpawnService extends IService {


    public static * run (this: Thread<{roomName: string}> , roomName: string): Generator<unknown, any, unknown> {

        if(Game.rooms[roomName] === undefined) {
            console.log("RunSpawns could not find room " + roomName + ", destroying thread.");
            return;
        }

        while(true) {

            // TODO use repo
            const spawns = Game.rooms[roomName].find(FIND_MY_SPAWNS);

            if(spawns.length <= 0) {
                console.log(`${roomName} does not have any active spawns.`);
                yield * sleep(5);
                continue;
            }

        }

    }
}
