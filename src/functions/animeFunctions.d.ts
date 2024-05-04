import { Producer, Season } from "../types/animeModel";
import { Episode } from "../types/episodeModel";
export declare function genToArray(gen: string): string[];
export declare function tupleToProducer(data: any[]): Producer[];
export declare function tupleToSeason(data: any[]): Season[];
export declare function getEpsFromSeason(ani: string, season: string): Promise<Episode[]>;
export declare const parseAnime: (animeString: string) => {
    id: string;
    name: string;
    watched_episodes: number;
    start_date: string;
    finish_date: string;
    rate: number;
    state: string;
    times_watched: number;
    priority: string;
    rewatched_episodes: number;
    last_ep: any;
};
export declare function getLabelText(value: number, ratingValue: {
    [index: string]: string;
}): string;
export declare const handleRatingValue: (value: number, context: GlobalContextType, ani: string) => Promise<void>;
