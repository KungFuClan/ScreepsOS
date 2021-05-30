import { CommonRoomHelper } from "common/Helpers/Common_RoomHelper";
import { CreepRepo } from "Repositories/CreepRepo";
import { Logger } from "utils/Logger";
import { RoleConstants } from "Creep/interfaces/CreepConstants";
import _ from "lodash";
import { structureRepo } from "Repositories/StructureRepo";

const _logger = new Logger("MinerHelper");

interface SourceSaturation {
    source: Source;
    workParts: number;
};
export class MinerHelper {

    /**
     * Get the source we should target with the lowest work part saturation
     * @param sources The sources we're considering
     * @param roomName the room we are in
     * @returns The source we should be tareting
     */
    public static GetSourceWithLowestWorkSaturation(sources: Source[], roomName: string): Source {
        const minerRoles = [RoleConstants.MINER];
        const sourceOptions: SourceSaturation[] = []

        for(const source of sources) {
            const numAccessTiles = CommonRoomHelper.GetNumOpenTiles(source.pos);
            const creepsTargeting = CreepRepo.GetCreepsTargetingObjectByRoles(source, minerRoles);
            if(creepsTargeting.length < numAccessTiles) {
                const workParts = _.sum(creepsTargeting,
                    (creep) =>
                        _.filter(creep.body, (part) => part.type === WORK).length
                    );
                sourceOptions.push({
                    source,
                    workParts
                });
            }
        }

        if(sourceOptions.length === 0) {
            _logger.warn(`Miner in ${roomName} could not find suitable source to work.`);
        }

        const lowestSaturatedSource = sourceOptions.reduce((previous, current) => previous.workParts < current.workParts ? previous : current);
        return lowestSaturatedSource.source;
    }

    /**
     * Get the mining container for the specified source
     * @param source The source we are getting the mining container for
     * @returns The closest container if it exists
     */
    public static GetMiningContainer(source: Source): StructureContainer | null {
        const containers = structureRepo.getStructure<StructureContainer>(STRUCTURE_CONTAINER, source.room.name);
        if(containers.length === 0) return null;
        const closestContainer = source.pos.findClosestByRange(containers);
        if(!closestContainer) return null;
        return source.pos.isNearTo(closestContainer.pos) ? closestContainer : null;
    }
}
