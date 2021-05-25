import { CaptainService } from "Creep/CreepRunners/CaptainService";
import { DeckhandService } from "Creep/CreepRunners/DeckhandService";
import { MinerService } from "Creep/CreepRunners/MinerService";
import { TenderService } from "Creep/CreepRunners/TenderService";

export enum RoleConstants {
    MINER = "miner",
    TENDER = "tender",
    DECKHAND = "deckhand",
    CAPTAIN = "captain"
};

export const CreepRunners = {
    [RoleConstants.MINER]: MinerService,
    [RoleConstants.TENDER]: TenderService,
    [RoleConstants.DECKHAND]: DeckhandService,
    [RoleConstants.CAPTAIN]: CaptainService
};
