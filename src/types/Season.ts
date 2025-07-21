import {Episode, EpisodeDTO} from "./Episode";
export interface Season{
    id:string;
    name: string;
    episodes: Episode[];
    index: number;
    anime_id:string;
}
export interface SeasonDTO extends Season{
    episodes:EpisodeDTO[]
}