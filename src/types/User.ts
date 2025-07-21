import {AnimeUser} from "./Anime.ts";
import {UserRole} from "./types.ts";

interface GoogleLogin{
    idToken:string;
    accessToken:string;
}

interface Role{
    id:number;
    name:UserRole
}

export interface User{
    id:string;
    name:string;
    email:string;
    surname:string
    username:string;
    birthDate:Date;
    roles:Role[]
    animelist: AnimeUser;
    superuser:boolean;
}
