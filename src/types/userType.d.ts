import { ObjectId } from "mongoose";
import { AnimeUser } from "./animeModel";
import { MangaUser } from "./mangaType";
export interface User {
    _id: ObjectId;
    name: string;
    surname: string;
    username: string;
    birthDate: Date;
    email: string;
    password: string;
    salt: string;
    totalAnime: number;
    totalAnimeWatching: number;
    totalAnimeCompleted: number;
    totalAnimeDropped: number;
    totalAnimePlanToWatch: number;
    totalManga: number;
    totalMangaReading: number;
    totalMangaCompleted: number;
    totalMangaDropped: number;
    totalMangaPlanToRead: number;
    animeList: AnimeUser[];
    mangaList: MangaUser[];
    totalAnimeLiked: AnimeUser[];
    totalMangaLiked: MangaUser[];
}
