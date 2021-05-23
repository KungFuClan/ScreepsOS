/* eslint-disable camelcase */
import { FilterConstants } from "./interfaces";
import { Logger } from "utils/Logger";

export class StructureRepo {

    public cache: {
        [roomName: string]: {
            [structureType in StructureConstant]?: {
                [filterName in FilterConstants]?: Id<Structure>[]
            }
        }
    };

    public name = "StructureRepo";

    public constructor() {
        this.cache = {};
        return;
    }

    public getOnlyObjectsById<T extends Structure<StructureConstant>>(values: Id<Structure>[]): T[] {

        const objects: Structure[] = [];

        for(const structId of values) {
            const obj = Game.getObjectById(structId);
            if(obj !== null) {
                objects.push(obj);
            }
        }

        // TODO Find a better way to get this through, without using 'as'
        return objects as T[];

    }

    public getStructure<T extends Structure>(structureType: StructureConstant, roomName: string): T[] {

        if(this.cache[roomName] === undefined) {
            this.cache[roomName] = {};
        }

        if(this.cache[roomName][structureType] === undefined) {
            this.cache[roomName][structureType] = {};
        }

        if(this.cache[roomName][structureType]![FilterConstants.ALL] !== undefined) {
            return this.getOnlyObjectsById<T>(this.cache[roomName][structureType]![FilterConstants.ALL]!);
        } else {

            if(!Game.rooms[roomName]) {
                throw new Error("Could not run StructureRepo.getStructure on room that is not visible. " + roomName);
            }

            const structures = Game.rooms[roomName].find(FIND_STRUCTURES, {filter: {structureType}}) as Structure[];
            this.cache[roomName][structureType]![FilterConstants.ALL] = structures.map(struct => struct.id);

            Logger.withPrefix('[StructureRepo]').alert("Got uncached structures of type: " + structureType);

            return structures as T[];

        }

    }

    public getStructure_My<T extends OwnedStructure>(structureType: StructureConstant, roomName: string): T[] {

        const structs = this.getStructure<T>(structureType, roomName);

        return structs.filter(struct => struct.my);

    }
}

// eslint-disable-next-line prefer-const
export let structureRepo = new StructureRepo();
