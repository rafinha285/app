/// <reference types="cookie-parser" />
import { animeClient, logPool } from "../database/Postgre";
import { Request, Response } from "express";
import { animeListStatus } from "../../src/types/animeModel";
import { JwtUser } from "../types";
import { EpisodeUser } from "../../src/types/episodeModel";
import { QueryResult } from "pg";
import { JwtPayload } from "jsonwebtoken";
export declare function epWatchedHandle(req: Request, res: Response, animeC: typeof animeClient, log: typeof logPool, user: string | JwtUser | JwtPayload | undefined): Promise<void>;
export declare function checkAnimeList(user: JwtUser, animeId: string, animeC: typeof animeClient): Promise<boolean>;
export declare function checkEpList(user: JwtUser, animeId: string, epId: string, animeC: typeof animeClient): Promise<boolean>;
export declare function insertAnimeList(animeC: typeof animeClient, anime: any, user: JwtUser, status: animeListStatus): Promise<void>;
export declare function insertEpList(animeC: typeof animeClient, animeId: string, seasonId: string, epId: string, droppedOn: number, epIndex: number, duration: number, user: JwtUser, watched: boolean, epName: string, seasonName: string): Promise<void>;
export declare function getAllEpsList(animeId: string, seasonId: string, user: JwtUser, animeC: typeof animeClient): Promise<QueryResult<EpisodeUser[]>>;
