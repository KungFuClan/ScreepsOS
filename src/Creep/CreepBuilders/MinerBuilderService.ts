import { EnergyTier, SpawningOptions } from "Spawn/interfaces";

import { CommonRoomHelper } from "common/Helpers/Common_RoomHelper";
import { ICreepBuilder } from "Creep/interfaces/interfaces";
import { BodyDefinition } from "Spawn/BodyParts";

export const MinerBuilder: ICreepBuilder = {

    * runBuilder(roomName: string, spawnOptions: SpawningOptions): Generator {

        const roomEnergyTier = spawnOptions.energyTier || CommonRoomHelper.getEnergyTier(roomName);

        const body: BodyDefinition = {

        }

        switch(roomEnergyTier) {

            case(EnergyTier.T1):
                body[WORK] = 2;
                body[MOVE] = spawnOptions.offRoad ? 2 : 1;
                break;
            case(EnergyTier.T2):
                body[WORK] = 3;
                break;
            case(EnergyTier.T3):
                body[WORK] = 5;
                break
            case(EnergyTier.T4):
                break;
            case(EnergyTier.T5):
                break;
            case(EnergyTier.T6):
                break;
            case(EnergyTier.T7):
                break;
            case(EnergyTier.T8):
                break;
        }

        yield;
    }

}
