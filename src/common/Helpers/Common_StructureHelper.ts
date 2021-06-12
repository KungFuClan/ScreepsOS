import { CommonRoomHelper } from "./Common_RoomHelper";
import { InvalidActionTargetError } from "common/errors";
import { StoreStructures } from "common/interfaces";

export class CommonStructureHelper {

    public static UsedAmount(target: RoomObject): number {

        if(target instanceof StoreStructures || target instanceof Ruin || target instanceof Tombstone) {

            const store: GenericStore = target.store;
            return store.getUsedCapacity() || 0;
        }

        if(target instanceof Resource) {
            return target.amount;
        }

        return 0;
    }

    public static isStoreStructure(target: RoomObject): boolean {

        return (
        target instanceof StructureExtension
        || target instanceof  StructureFactory
        || target instanceof  StructureLab
        || target instanceof  StructureLink
        || target instanceof  StructureNuker
        || target instanceof  StructurePowerSpawn
        || target instanceof  StructureSpawn
        || target instanceof  StructureStorage
        || target instanceof  StructureTerminal
        || target instanceof  StructureTower
        || target instanceof  StructureContainer);
    }

}
