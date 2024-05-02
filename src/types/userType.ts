import { ObjectId } from "mongoose";
import { AnimeUser } from "./animeModel"
import { MangaUser } from "./mangaType";
import { roles } from "./types";

interface GoogleLogin{
    idToken:string;
    accessToken:string;
}
export interface User{
    _id:ObjectId;
    name:string;
    surname:string
    username:string;
    birthDate:Date;
    email:string;
    role:roles[]
    password:string;
    salt:string;
    totalanime:number;
    totalanimewatching:number;
    totalanimecompleted:number;
    totalanimeonhold:number;
    totalanimedropped:number;
    totalanimeplantowatch:number;
    totalmanga:number;
    totalmangareading:number;
    totalmangacompleted:number;
    totalmangaonhold:number;
    totalmangadropped:number;
    totalmangaplantoread:number;
    animelist:AnimeUser[]|string;
    mangalist:MangaUser[];
    totalanimeliked:string[];
    totalmangaliked:string[]
}