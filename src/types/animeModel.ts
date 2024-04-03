import { Audio , state,quality, StateType} from "./types" 
import { character } from "./characterModel"
// import {Season} from "./seasonModel"
import { Episode } from "./episodeModel";
import { EpisodeUser } from "./episodeModel";
import {types} from "cassandra-driver"
import nano from "nano";
// export interface Anime{
//     _id:string;
// 	name:string;
// 	name2:string;
// 	description:string;
// 	quality:quality;
// 	language:Audio;
// 	state:string;
// 	releasedate:Date;
// 	studios:string[]|string;
// 	producers:string[]|string;
// 	creators:string[]|string;
// 	genre:string[]|string;
// 	seasons?:Season[];
// 	rating?:number;
// 	characters?:character[];
// 	// path?:string;
// 	averageeptime?:number;
// }
// export interface AnimeDocument extends nano.DocumentGetResponse{
// 	_id:string;
// 	name:string;
// 	name2:string;
// 	description:string;
// 	quality:quality;
// 	language:Audio;
// 	state:state;
// 	releasedate:Date;
// 	studios:string[];
// 	producers:string[];
// 	creators:string[];
// 	generos:string[];
// 	seasons?:Season[];
// 	rating?:number;
// 	characters?:character[];
// 	// path?:string;
// 	averageEptime?:number;
// }
// export interface AnimeUser{
// 	animeId:string
//     name:string;
//     watchedEpisodes:number;
//     lastEp:EpisodeUser
// }
// export interface producers{
// 	producerid:number;
// 	producername:string;
// }
// export interface studios{
// 	studioid:number;
// 	studioname:string;
// }
// export interface creators{
// 	creatorid:number;
// 	creatorname:string;
// }
export interface Producer{
	id:string;
	name:string;
}
export interface Season{
    _id:string;
    name: string;
    episodes: Episode[];
    index: number;
    animeId: string;
}
export interface Anime{
    id:string;
	name:string;
	name2:string;
	description:string;
	quality:quality;
	language:Audio;
	state:string;
	releasedate:Date;
	studios:types.Tuple[]|string[][]|string[];
	producers:types.Tuple[]|string[][]|string[];
	creators:types.Tuple[]|string[][]|string[];
	genre:string[];
	seasons?:Season[];
	rating?:number;
	characters?:character[];
	// path?:string;
	averageeptime?:number;
	date_added?:Date;
}
export interface AnimeUser{
	animeId:string
    name:string;
    watchedEpisodes:number;
    lastEp:EpisodeUser
}
