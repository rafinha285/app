// import mongoose,{ ObjectId, Schema ,Document,model, Types} from "mongoose";
// import {v4 as uuidv4} from "uuid"
// export enum Audio{
//     DUB = "Dublado",
//     LEG = "Legendado",
//     BOTH = "Dublado/Legendado"
// }
// export enum languages{
//     Japanese = 'ja',
//     Portuguese = 'pt',
//     English = 'en',
//     Spanish = 'es',
// }
// export enum quality{
//     FULLHD = "1080p",
//     HD = "720p",
//     SD = "480p"
// }
// export enum state{
// 	ONGOING="Lançando",
// 	HIATUS="Hiáto",
// 	COMPLETED="Completo",
// 	CANCELED= "Cancelado"
// }
// export interface character{
//     _id:ObjectId;
//     name:string;
//     role:string;
//     anime: Anime;
// }
// interface AudioTracks{
//     language:languages
// }
// interface SubtitlesTracks{
//     language:languages
// }
// export interface Episode extends Document{
//     _id:string;
//     index:number;
//     name:string;
//     season:mongoose.Types.ObjectId;
//     releaseDate:Date;
//     views:number;
//     duration:number;
//     openingStart:number;
//     openinigEnd:number;
//     ending:number;
//     audioTracks:AudioTracks[];
//     subtitlesTracks:SubtitlesTracks[]
// }
// export interface Season extends Document{
//     _id:mongoose.Types.ObjectId;
//     name:string;
//     episodes:Episode[];
//     index:number;
//     animeId: mongoose.Types.ObjectId;
// }
// export interface Anime extends Document{
//     _id?:mongoose.Types.ObjectId
// 	name:string;
// 	name2:string;
// 	description:string;
// 	quality:quality;
// 	language:Audio;
// 	state:state;
// 	releaseDate:Date;
// 	studios:string[];
// 	producers:string[];
// 	creators:string[];
// 	generos:string[];
// 	seasons:Season[];
// 	rating:number;
// 	characters:character[];
// 	path:string;
// 	averageEptime:number;
// }
// interface EpisodesUser{
//     name:string;
//     droppedOn:number;
//     episodeId:ObjectId
// }
// export interface AnimeUser{
//     animeId:ObjectId
//     name:string;
//     watchedEpisodes:number;
//     lastEp:EpisodesUser
// }
// export const characterSchema = new Schema<character>({
//     name:{type:String,required:true},
//     role:{type:String},
//     anime:{type:Schema.Types.ObjectId,ref:"Anime"}
// })
// const episodesSchema = new Schema<Episode&Document>({
//     _id:{type:mongoose.Types.ObjectId},
//     name:{type:String,required:true},
//     index:{type:Number,required:true},
//     season:{type:Schema.Types.ObjectId,ref:"Season",required:true},
//     releaseDate:{type:Date,required:true},
//     views:{type:Number},
//     duration:{type:Number,required:true},
//     openingStart:{type:Number},
//     openinigEnd:{type:Number},
//     ending:{type:Number},
//     audioTracks:[{type:String,enum:languages}],
//     subtitlesTracks:[{type:String,enum:languages}]
// })
// const episodeModel = model<Episode>("Episodes",episodesSchema,"episodes")
// const seasonSchema = new Schema<Season>({
//     _id:{type:mongoose.Schema.ObjectId,auto:true},
//     name:{type:String},
//     episodes:[{type:episodesSchema,ref:"Anime"}],
//     index:{type:Number},
//     animeId:{type:Schema.Types.ObjectId,ref:"Anime"}
// })
// const seasonModel = model<Season>("Season",seasonSchema,"seasons")
// const animeSchema = new Schema<Anime & Document>({
//     name:{type:String},
//     name2:{type:String},
//     description:{type:String},
//     quality:{type:String,enum:Object.values(quality)},
//     language:{type:String,enum:Object.values(Audio)},
//     state:{type:String,enum:state},
//     releaseDate:{type:Date},
//     studios:[{type:String}],
//     producers:[{type:String}],
//     creators:[{type:String}],
//     generos:[{type:String}],
//     seasons:[{type:seasonModel,unique:true}],
//     rating:{type:Number},
//     characters:[characterSchema],
//     path:{type:String},
//     averageEptime:{type:Number}
// },{
//     bufferCommands:true
// })
// const Ani = model<Anime>("Anime",animeSchema,"anime")
