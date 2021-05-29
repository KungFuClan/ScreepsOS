import { CaptainBuilder } from "Creep/CreepBuilders/CaptainBuilderService";
import { CaptainService } from "Creep/CreepRunners/CaptainService";
import { DeckhandBuilder } from "Creep/CreepBuilders/DeckhandBuilderService";
import { DeckhandService } from "Creep/CreepRunners/DeckhandService";
import { MinerBuilder } from "Creep/CreepBuilders/MinerBuilderService";
import { MinerService } from "Creep/CreepRunners/MinerService";
import { TenderBuilder } from "Creep/CreepBuilders/TenderBuilderService";
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

export const CreepBuilders = {
    [RoleConstants.MINER]: MinerBuilder,
    [RoleConstants.TENDER]: TenderBuilder,
    [RoleConstants.DECKHAND]: DeckhandBuilder,
    [RoleConstants.CAPTAIN]: CaptainBuilder
}
