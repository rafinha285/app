export declare enum languages {
    Japanese = "ja",
    Portuguese = "pt",
    English = "en",
    Spanish = "es"
}
export interface SubtitlesTracks {
    language: languages;
}
export interface Episode {
    id: string;
    epindex: number;
    name: string;
    animeid: string;
    releasedate: Date;
    views?: number;
    duration?: number;
    openingstart: number;
    openingend: number;
    ending: number;
    audiotracks: languages[];
    subtitlestracks?: string[];
    seasonid: string;
    resolution: string[];
}
export interface EpisodeUser {
    name: string;
    droppedOn: number;
    episodeId: string;
}
export interface EpisodeSim {
    id: string;
    animeid: string;
    seasonid: string;
    name: string;
    duration: number;
    resolution: string[];
    animename: string;
}
