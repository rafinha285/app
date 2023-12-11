export enum page{
    ANIMEPAGE = "ANIMEPAGE",
    HOME = "HOME",
    SEARCH = "SEARCH",
    WATCH = "WATCH"
}
export interface Log{
    // _id:string;
    date:Date;
    anime?:string;
    manga?:string;
    page:page
    duration?:number;
    ep?:string
}