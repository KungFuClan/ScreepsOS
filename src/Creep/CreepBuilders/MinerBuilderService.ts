import { EnergyTier, SpawningOptions } from "Spawn/interfaces";

import { BodyDefinition } from "Spawn/BodyParts";
import { CommonRoomHelper } from "common/Helpers/Common_RoomHelper";
import { CreepBuilderHelper } from "./CreepBuilderHelper";
import { ICreepBuilder } from "Creep/interfaces/interfaces";

export const MinerBuilder: ICreepBuilder = {

    runBuilder(roomName: string, spawnOptions: SpawningOptions = {}): BodyDefinition {

        const roomEnergyTier = spawnOptions.energyTier || CommonRoomHelper.getEnergyTier(roomName);

        const body: BodyDefinition = {

        }

        switch(roomEnergyTier) {

            case(EnergyTier.T1):
                body[WORK] = 2;
                body[MOVE] = 2;
                break;
            case(EnergyTier.T2):
                body[WORK] = 5;
                body[MOVE] = 1;
                break;
            case(EnergyTier.T3):
            case(EnergyTier.T4):
            case(EnergyTier.T5):
            case(EnergyTier.T6):
            case(EnergyTier.T7):
            case(EnergyTier.T8):
                body[WORK] = 5;
                body[MOVE] = 3;
                break;
        }

        CreepBuilderHelper.AdjustForSpawnOptions(body, roomName, spawnOptions);

        return body;
    }

}
