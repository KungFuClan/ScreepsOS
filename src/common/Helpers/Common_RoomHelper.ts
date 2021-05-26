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
}
