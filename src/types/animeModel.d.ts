import { Audio, quality, userAnimeState, priorityValue } from "./types";
import { character } from "./characterModel";
import { EpisodeUser } from "./episodeModel";
import { types } from "cassandra-driver";
export interface Producer {
    id: string;
    name: string;
}
export interface Season {
    id: string;
    name: string;
    episodes: string[];
    index: number;
}
export interface SeasonList {
    anime_id: string;
    season_id: string;
    total_episodes: number;
    total_rewatched_episodes?: number;
    id?: number;
}
export interface Anime {
    id: string;
    name: string;
    name2: string;
    description: string;
    quality: quality;
    language: Audio;
    state: string;
    releasedate: Date;
    studios: types.Tuple[] | string[][] | string[];
    producers: types.Tuple[] | string[][] | string[];
    creators: types.Tuple[] | string[][] | string[];
    genre: string[];
    seasons?: Season[] | types.Tuple[];
    rating?: number;
    characters?: character[];
    averageeptime?: number;
    date_added?: Date;
}
export interface AnimeUser {
    id: number;
    anime_id: string;
    name: string;
    start_date?: Date;
    finish_date?: Date;
    rate: number;
    state: userAnimeState;
    priority: priorityValue;
    last_ep: EpisodeUser[];
}
export interface AnimeSearch {
    id: string;
    name: string;
    description: string;
    rating: number;
}
export interface AnimeAgenda {
    id: string;
    name: string;
    description: string;
    rating: number;
    weekday: string;
}
export declare enum animeListStatus {
    'watching' = 0,
    'completed' = 1,
    'on_hold' = 2,
    'dropped' = 3,
    'plan_to_watch' = 4
}
