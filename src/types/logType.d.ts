export declare enum page {
    ANIMEPAGE = "ANIMEPAGE",
    HOME = "HOME",
    SEARCH = "SEARCH",
    WATCH = "WATCH"
}
export interface Log {
    date: Date;
    anime?: string;
    manga?: string;
    page: page;
    duration?: number;
    ep?: string;
}
