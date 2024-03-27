import { quality } from "./types";
export declare enum page {
    ANIMEPAGE = "ANIMEPAGE",
    HOME = "HOME",
    SEARCH = "SEARCH",
    WATCH = "WATCH"
}
export interface Log {
    date: Date;
    anime?: string;
    manga?: string;
    page: page;
    duration?: number;
    ep?: string;
}
export interface epLog {
    date: Date;
    anime: string;
    season: string;
    ep: string;
    name: string;
    duration: number;
    animename: string;
    resolution: quality;
    seasonname: string;
}
