export class PathfindingHelper {

    public static GetDefaultMoveOpts(creep?: Creep): MoveToOpts {
        const DEFAULT_OPTS = {
            heuristicWeight: 1.5, // Test this to see if we can afford to raise it ( higher number = less CPU use, lower number = more likely to get best path each time)
            range: 0, // Assume we want to go to the location, if not told otherwise
            ignoreCreeps: true,
            reusePath: 999,
            maxRooms: 16, // TODO Look into a way to make this dynamic, so that we don't waste CPU when doing things like finding a path to an object in the same room, but there's no path so we cycle through 64 rooms and halt
            // swampCost: 5, // Putting this here as a reminder that we can make bigger creeps that can move on swamps
            visualizePathStyle: {}, // Empty object for now, just uses default visualization
            costCallback(roomName: string, costMatrix: CostMatrix): any  {
                if (PathfindingHelper.UseRoomForCostMatrix(roomName, costMatrix, creep)) {
                    PathfindingHelper.SetCreepCostMatrix(roomName, costMatrix);
                } else {
                    PathfindingHelper.BlockRoomForCostMatrix(roomName, costMatrix);
                }
                return costMatrix;
            }
        };

        return DEFAULT_OPTS;
    }

     /**
     * Use this function to set the default CostMatrix values for creeps
     * @param roomName The roomname being processed
     * @param costMatrix The costMatrix object to set the values on
     */
      public static SetCreepCostMatrix(roomName: string, costMatrix: CostMatrix): void {
        _.forEach(Game.creeps, (creep: Creep) => {
            // If not in the room, do nothing
            if (creep.pos.roomName !== roomName) {
                return;
            }

            let matrixValue;

            if (creep.my) {
                if (creep.memory.working === true) { // || creep.memory.target === undefined) {
                    // Walk around working creeps or idling creeps
                    matrixValue = 255;
                } else {
                    // Walk through creeps with a job, but not working (AKA traveling)
                    const terrainValue = new Room.Terrain(roomName).get(creep.pos.x, creep.pos.y);
                    // Match the terrain underneath the creep to avoid preferring going under creeps
                    matrixValue = terrainValue > 0 ? 5 : 1;
                }
            } else {
                // If creep is not ours, we can only walk on it if we are in safe mode
                if (creep.room.controller && creep.room.controller.safeMode !== undefined) {
                    const terrainValue = new Room.Terrain(roomName).get(creep.pos.x, creep.pos.y);
                    matrixValue = terrainValue > 0 ? 5 : 1;
                } else {
                    matrixValue = 255;
                }
            }

            costMatrix.set(creep.pos.x, creep.pos.y, matrixValue);
        });
    }

    /**
     * Use this function to set the default RoomStatus callback values
     * @param roomName The roomname being processed
     * @param costMatrx The costMatrix object to set the values on
     */
    public static UseRoomForCostMatrix(roomName: string, costMatrix?: CostMatrix, creep?: Creep): boolean {
        // Always allow pathing in the creeps current room and target room
        if (creep?.room.name === roomName || creep?.memory.targetRoom === roomName) {
            return true;
        }

        // const roomStatus = this.retrieveRoomStatus(roomName);
        const roomStatus = true;

        // Todo - Retrieve the lastSeen for the room as well for decisions about rooms that haven't been seen in a while

        switch (roomStatus) {
            // case ROOM_STATUS_ALLY:
            //     return true;
            // case ROOM_STATUS_ALLY_REMOTE:
            //     return true;
            // case ROOM_STATUS_HIGHWAY:
            //     return true;
            // case ROOM_STATUS_NEUTRAL:
            //     return true;
            // case ROOM_STATUS_HOSTILE:
            //     return false;
            // case ROOM_STATUS_HOSTILE_REMOTE:
            //     return false;
            // case ROOM_STATUS_UNKNOWN:
            //     return true;
            // case ROOM_STATUS_SOURCE_KEEPER:
            //     return true;
            // case ROOM_STATUS_INVADER_REMOTE:
            case true:
                return true;
            default:
                return true;
                // return false;
        }
    }

    /**
     * Creates a room where all sides are considered unwalkable
     */
    public static BlockRoomForCostMatrix(roomName: string, costMatrix: CostMatrix): void {
        for (let i = 0; i < 50; i++) {
            costMatrix.set(i, 0, 255);
            costMatrix.set(i, 49, 255);
            costMatrix.set(0, i, 255);
            costMatrix.set(49, i, 255);
        }
    }

}
