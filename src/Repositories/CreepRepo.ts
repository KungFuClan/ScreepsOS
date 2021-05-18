/* eslint-disable camelcase */
import { RepoFilters } from "./RepoFilters";

export class CreepRepo {

    public static getAllCreeps(): Creep[] {
        return _.map(Game.creeps, creep => creep);
    }

    public static getAllCreeps_My(): Creep[] {
        return RepoFilters.isMy<Creep>(this.getAllCreeps());
    }
}
