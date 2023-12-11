import { Episode } from "./episodeModel";
export interface Season{
    _id:string;
    name:string;
    episodes:Episode[];
    index:number;
    animeId: string;
}
