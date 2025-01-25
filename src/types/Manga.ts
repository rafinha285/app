enum MaStatus{
    PlanToRead = "Plan to Read",
    Reading = "Reading",
    Dropped = "Dropped",
    Completed = "Completed"
}
interface chapter{
    _id:string;
    name:string;
    releaseDate:Date;
    index:number;
}
export interface Manga{
    _id:string;
    name:string;
    releaseDate:Date;
    generos:[string];
    creator:[string];
    chapters:chapter[]
}
interface chapUser{
    chapId:string;
    name:string;
}
export interface MangaUser{
    mangaId:string;
    name:string;
    readChapters:number;
    lastChapter:chapUser;
    startDate:Date;
    finishDate:Date;
    rating:number;
    status:MaStatus;
}
