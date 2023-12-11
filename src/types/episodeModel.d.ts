import nano from "nano";
import { quality } from "./types";
export declare enum languages {
    Japanese = "ja",
    Portuguese = "pt",
    English = "en",
    Spanish = "es"
}
interface AudioTracks {
    language: languages;
}
export interface SubtitlesTracks {
    language: languages;
}
export interface Episode {
    _id: string;
    index: number;
    name: string;
    animeId: string;
    releaseDate: Date;
    views: number;
    rating: number;
    duration: number;
    openingStart: number;
    openinigEnd: number;
    ending: number;
    audioTracks: languages[];
    subtitlesTracks: string[];
    resolution: quality;
}
export interface EpisodeDocument extends nano.DocumentGetResponse {
    _id: string;
    index: number;
    name: string;
    animeId: string;
    releaseDate: Date;
    views: number;
    rating: number;
    duration: number;
    openingStart: number;
    openinigEnd: number;
    ending: number;
    audioTracks: AudioTracks[];
    subtitlesTracks: SubtitlesTracks[];
    resolution: quality;
}
export interface EpisodeUser {
    name: string;
    droppedOn: number;
    episodeId: string;
}
export {};
