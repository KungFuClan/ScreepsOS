import { CaptainService } from "./CaptainService";
import { DeckhandService } from "./DeckhandService";
import { MinerService } from "./MinerService";
import { RoleConstants } from "Creep/interfaces/CreepConstants";
import { TenderService } from "./TenderService";

export const CreepRunners = {
    [RoleConstants.MINER]: MinerService,
    [RoleConstants.TENDER]: TenderService,
    [RoleConstants.DECKHAND]: DeckhandService,
    [RoleConstants.CAPTAIN]: CaptainService
};
