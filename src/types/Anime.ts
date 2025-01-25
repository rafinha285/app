import {Audio, state, quality, StateType, userAnimeState, priorityValue, Producer} from "./types"
import { Episode } from "./Episode";
import { EpisodeUser } from "./Episode";

export interface Anime{
    id:string;
	name:string;
	name2:string;
	description:string;
	quality:quality;
	language:Audio;
	state:state;
	releasedate:Date;
	studios:string[];
	producers:string[];
	creators:string[];
	genre:string[];
	rating?:number;
	averageeptime?:number;
	date_added?:Date;
	visible:boolean;
	weekday:string
}
export interface AnimeUser{
	user_id:string;
	id:number
	anime_id:string
    name:string;
	start_date?:Date;
	finish_date?:Date;
	rate:number;
	status:userAnimeState;
	priority:priorityValue;
    last_ep:EpisodeUser[]
}
export interface AnimeSearch{
	id:string;
	name:string;
	description:string;
}
export interface AnimeAgenda{
	id:string;
	name:string;
	description:string;
	rating:number;
	weekday:string
}
export enum animeListStatus{
	'watching', 'completed', 'on_hold', 'dropped', 'plan_to_watch'
}
