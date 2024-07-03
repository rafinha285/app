/// <reference types="cookie-parser" />
import { animeClient, logPool } from "../database/Postgre";
import { Request, Response } from "express";
import { JwtUser } from "../types";
import { types } from "cassandra-driver";
export declare function epWatchedHandle(req: Request, res: Response, anime: typeof animeClient, log: typeof logPool): Promise<void | Response<any, Record<string, any>>>;
export declare function addSeason(seasonId: string, req: Request, ep: types.Row, aniId: string): Promise<void>;
export declare function editSeason(seasonId: string, req: Request, aniId: string, ep: types.Row): Promise<import("pg").QueryResult<any>>;
export declare function editEpisode(user: JwtUser, aniId: string, ep: types.Row, mud: number): Promise<import("pg").QueryResult<any>>;
export declare function checkAnimeList(user: JwtUser, animeId: string): boolean;
