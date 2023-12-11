import { Audio , state,quality} from "./types" 
import { character } from "./characterModel"
import {Season} from "./seasonModel"
import { EpisodeUser } from "./episodeModel";
import nano from "nano";
export interface Anime{
    _id:string;
	name:string;
	name2:string;
	description:string;
	quality:quality;
	language:Audio;
	state:state;
	releaseDate:Date;
	studios:string[];
	producers:string[];
	creators:string[];
	generos:string[];
	seasons?:Season[];
	rating?:number;
	characters?:character[];
	path?:string;
	averageEptime?:number;
}
export interface AnimeDocument extends nano.DocumentGetResponse{
	_id:string;
	name:string;
	name2:string;
	description:string;
	quality:quality;
	language:Audio;
	state:state;
	releaseDate:Date;
	studios:string[];
	producers:string[];
	creators:string[];
	generos:string[];
	seasons?:Season[];
	rating?:number;
	characters?:character[];
	path?:string;
	averageEptime?:number;
}
export interface AnimeUser{
	animeId:string
    name:string;
    watchedEpisodes:number;
    lastEp:EpisodeUser
}