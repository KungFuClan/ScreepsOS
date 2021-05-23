import _ from "lodash";
export class RepoFilters {

    public static isMy<T extends Creep | AnyOwnedStructure>(objects: T[]): T[] {
        const myObjects = [];
        for(const object of objects) {
            if(object.my) {
                myObjects.push(object);
            }
        }
        return myObjects;
    }
}

