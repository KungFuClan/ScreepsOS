import { EnergyTier, SpawningOptions } from "Spawn/interfaces";

import { BodyDefinition } from "Spawn/BodyParts";
import { CommonRoomHelper } from "common/Helpers/Common_RoomHelper";
import { CreepBuilderHelper } from "./CreepBuilderHelper";
import { ICreepBuilder } from "Creep/interfaces/interfaces";

export const TenderBuilder: ICreepBuilder = {

    runBuilder(roomName: string, spawnOptions: SpawningOptions = {}): BodyDefinition {

        const roomEnergyTier = spawnOptions.energyTier || CommonRoomHelper.getEnergyTier(roomName);

        const body: BodyDefinition = {

        }

        switch(roomEnergyTier) {

            case(EnergyTier.T1):
                body[CARRY] = 3;
                body[MOVE] = 3;
                break;
            case(EnergyTier.T2):
                body[CARRY] = 5;
                body[MOVE] = 5;
                break;
            case(EnergyTier.T3):
                body[CARRY] = 12;
                body[MOVE] = 6;
                break;
            case(EnergyTier.T4):
                body[CARRY] = 16;
                body[MOVE] = 8;
                break;
            case(EnergyTier.T5):
                body[CARRY] = 24;
                body[MOVE] = 12;
                break;
            case(EnergyTier.T6):
            case(EnergyTier.T7):
            case(EnergyTier.T8):
                body[CARRY] = 30;
                body[MOVE] = 15;
                break;
        }

        CreepBuilderHelper.AdjustForSpawnOptions(body, roomName, spawnOptions);

        return body;
    }

}
