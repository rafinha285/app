import { quality } from "./types";
export enum languages{
    Japanese = 'ja',
    Portuguese = 'pt',
    English = 'en',
    Spanish = 'es',
}
interface AudioTracks{
    language:languages
}
export interface SubtitlesTracks{
    language:languages
}
export interface Episode{
    id:string
    epIndex:number;
    dateAdded:Date;
    name:string;
    animeId:string;
    seasonId:string
    releaseDate:Date;
    views?:number;
    duration:number;
    openingStart:number;
    openingEnd:number;
    ending:number;
    audiotracks:languages[];
    subtitlesTracks?:string[];
    resolution:string[]
    visible:Boolean;
}
export interface EpisodeUser{
    episode_id:string;
    dropped_on:number;
    season_id:string
    anime_id:string;
    user_id:string;
    id:string;
    date:Date;
    duration:number;
    ep_index:number;
    name:string;
    watched:boolean;
    finished:boolean;
}
export interface EpisodeDTO extends Episode{
    animeTitle: string;
    seasonTitle: string;
}
