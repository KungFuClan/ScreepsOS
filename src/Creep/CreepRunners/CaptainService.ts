import { ICreepRunner } from "Creep/interfaces/interfaces";
import { StringMap } from "common/interfaces";
import { ThreadState } from "OperatingSystem/interfaces";

export const CaptainService: ICreepRunner = {
    *runRole (creepName: string): Generator {

        const cache: StringMap<RoomObject | null> = {}

        while(Game.creeps[creepName]) {

            const creep = Game.creeps[creepName];

            yield ThreadState.SUSPEND;
        }
    }
}
