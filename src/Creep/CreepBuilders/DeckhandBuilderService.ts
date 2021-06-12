import { EnergyTier, SpawningOptions } from "Spawn/interfaces";

import { BodyDefinition } from "Spawn/BodyParts";
import { CommonRoomHelper } from "common/Helpers/Common_RoomHelper";
import { CreepBuilderHelper } from "./CreepBuilderHelper";
import { ICreepBuilder } from "Creep/interfaces/interfaces";

export const DeckhandBuilder: ICreepBuilder = {

    runBuilder(roomName: string, spawnOptions: SpawningOptions = {}): BodyDefinition {
        const roomEnergyTier = spawnOptions.energyTier || CommonRoomHelper.getEnergyTier(roomName);

        const body: BodyDefinition = {

        }


        // TODO Refine bodies to make sense
        switch(roomEnergyTier) {

            case(EnergyTier.T1):
                body[WORK] = 1;
                body[CARRY] = 1;
                body[MOVE] = 2;
                break;
            case(EnergyTier.T2):
                body[WORK] = 2;
                body[CARRY] = 2;
                body[MOVE] = 4;
                break;
            case(EnergyTier.T3):
                body[WORK] = 3;
                body[CARRY] = 3;
                body[MOVE] = 6;
                break;
            case(EnergyTier.T4):
                body[WORK] = 5;
                body[CARRY] = 5;
                body[MOVE] = 10;
                break;
            case(EnergyTier.T5):
                body[WORK] = 8;
                body[CARRY] = 8;
                body[MOVE] = 16;
                break;
            case(EnergyTier.T6):
            case(EnergyTier.T7):
            case(EnergyTier.T8):
                body[WORK] = 12;
                body[CARRY] = 12;
                body[MOVE] = 24;
                break;
        }

        CreepBuilderHelper.AdjustForSpawnOptions(body, roomName, spawnOptions);

        return body;
    }
}
