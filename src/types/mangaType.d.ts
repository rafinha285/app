import { ObjectId } from "mongoose";
declare enum MaStatus {
    PlanToRead = "Plan to Read",
    Reading = "Reading",
    Dropped = "Dropped",
    Completed = "Completed"
}
interface chapter {
    _id: ObjectId;
    name: string;
    releaseDate: Date;
    index: number;
}
export interface Manga {
    _id: ObjectId;
    name: string;
    releaseDate: Date;
    generos: [string];
    creator: [string];
    chapters: chapter[];
}
interface chapUser {
    chapId: ObjectId;
    name: string;
}
export interface MangaUser {
    mangaId: ObjectId;
    name: string;
    readChapters: number;
    lastChapter: chapUser;
    startDate: Date;
    finishDate: Date;
    rating: number;
    status: MaStatus;
}
export {};
