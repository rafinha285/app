import {Audio, state, quality, userAnimeState, priorityValue, Producer, State} from "./types"
import { EpisodeUser } from "./Episode";
import {Season, SeasonDTO} from "./Season";

export interface Anime{
    id:string;
	name:string;
	name2:string|undefined;
	description:string;
	quality:quality;
	language:Audio;
	state:State;
	releaseDate:string;
	studios:Producer[];
	producers:Producer[];
	creators:Producer[];
	genre:string[];
	rating?:number;
	averageEpTime?:number;
	date_added?:Date;
	visible:boolean;
	weekday:string;
    seasons: SeasonDTO[]
}
export interface AnimeUser{
	userId:string;
	anime:Anime
	status:userAnimeState;
	startDate?:Date;
	finishDate?:Date;
	rate:number;
	priority:priorityValue;
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
