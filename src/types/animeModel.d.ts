import { Audio, quality } from "./types";
import { character } from "./characterModel";
import { Episode } from "./episodeModel";
import { EpisodeUser } from "./episodeModel";
import { types } from "cassandra-driver";
export interface Producer {
    id: string;
    name: string;
}
export interface Season {
    _id: string;
    name: string;
    episodes: Episode[];
    index: number;
    animeId: string;
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
    seasons?: Season[];
    rating?: number;
    characters?: character[];
    averageeptime?: number;
    date_added?: Date;
}
export interface AnimeUser {
    animeId: string;
    name: string;
    watchedEpisodes: number;
    lastEp: EpisodeUser;
}
