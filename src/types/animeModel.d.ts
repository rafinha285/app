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
    id: string;
    name: string;
    watched_episodes: number;
    start_date: Date;
    finish_date?: Date;
    rate: number;
    state: userAnimeState;
    times_watched: number;
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
