import { CaptainBuilder } from "Creep/CreepBuilders/CaptainBuilderService";
import { DeckhandBuilder } from "Creep/CreepBuilders/DeckhandBuilderService";
import { MinerBuilder } from "Creep/CreepBuilders/MinerBuilderService";
import { RoleConstants } from "Creep/interfaces/CreepConstants";
import { TenderBuilder } from "Creep/CreepBuilders/TenderBuilderService";

export const CreepBuilders = {
    [RoleConstants.MINER]: MinerBuilder,
    [RoleConstants.TENDER]: TenderBuilder,
    [RoleConstants.DECKHAND]: DeckhandBuilder,
    [RoleConstants.CAPTAIN]: CaptainBuilder
}
