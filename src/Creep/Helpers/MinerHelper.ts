import { CommonRoomHelper } from "common/Helpers/Common_RoomHelper";
import { CreepRepo } from "Repositories/CreepRepo";
import { Logger } from "utils/Logger";
import { RoleConstants } from "Creep/interfaces/CreepConstants";

const _logger = new Logger("MinerHelper");
export class MinerHelper {

    /**
     * Get the source we should target with the lowest work part saturation
     * @param sources The sources we're considering
     * @param roomName the room we are in
     * @returns The source we should be tareting
     */
    public static GetSourceWithLowestWorkSaturation(sources: Source[], roomName: string): Source[] {
        const minerRoles = [RoleConstants.MINER];
        const creeps = CreepRepo.GetCreeps_My_ByRoom_ByName_ByRoles(roomName, minerRoles);
        const sourceOptions: Source[] = [];

        for(const source of sources) {
            const numAccessTiles = CommonRoomHelper.GetNumOpenTiles(source.pos);
            const numCreepsTargeting = _.filter(creeps, (creep) => creep.memory.target?.id === source.id).length;
            if(numCreepsTargeting < numAccessTiles) {
                sourceOptions.push(source);
            }
        }

        if(sourceOptions.length === 0) {
            _logger.warn(`Miner in ${roomName} could not find suitable source to work.`);
        }

        return sourceOptions;
    }
}
