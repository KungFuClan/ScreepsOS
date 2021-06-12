import { EnergyTier } from "Spawn/interfaces";
import { RoomRepo } from "Repositories/RoomRepo";
import { ThreadState } from "OperatingSystem/interfaces";

export class CommonRoomHelper {

    /**
     * Get the number of open tiles around an object
     * @param target The room position you're checking open tiles around
     * @returns Number of open tiles
     */
    public static GetNumOpenTiles(target: RoomPosition): number {
        let accessibleTiles = 0;
        const roomTerrain: RoomTerrain = new Room.Terrain(target.roomName);
        for (let y = target.y - 1; y <= target.y + 1; y++) {
            for (let x = target.x - 1; x <= target.x + 1; x++) {
                if (target.x === x && target.y === y) {
                    continue;
                }
                if (roomTerrain.get(x, y) !== TERRAIN_MASK_WALL) {
                    accessibleTiles++;
                }
            }
        }
        return accessibleTiles;
    }

    public static getEnergyTier(roomName: string): EnergyTier {

        if(!Game.rooms[roomName]) {
            throw new Error(`Could not find ${roomName} to get energy tier.`);
        }

        const energyAvailable = Game.rooms[roomName].energyCapacityAvailable;

        // Check what tier we are in based on the amount of energy the room has
        if (energyAvailable >= EnergyTier.T8) {
            return EnergyTier.T8;
        } else if (energyAvailable >= EnergyTier.T7) {
            return EnergyTier.T7;
        } else if (energyAvailable >= EnergyTier.T6) {
            return EnergyTier.T6;
        } else if (energyAvailable >= EnergyTier.T5) {
            return EnergyTier.T5;
        } else if (energyAvailable >= EnergyTier.T4) {
            return EnergyTier.T4;
        } else if (energyAvailable >= EnergyTier.T3) {
            return EnergyTier.T3;
        } else if (energyAvailable >= EnergyTier.T2) {
            return EnergyTier.T2;
        } else {
            return EnergyTier.T1;
        }

    }
}
