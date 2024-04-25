import { Producer, Season } from "../types/animeModel";
import { Episode } from "../types/episodeModel";
import { languages } from "../types/episodeModel";
export declare function genToArray(gen: string): string[];
export declare function tupleToProducer(data: any[]): Producer[];
export declare function tupleToSeason(data: any[]): Season[];
export declare function getEpsFromSeason(ani: string, season: string): Promise<Episode[]>;
declare global {
    interface Date {
        getDayOfWeekName(): string;
        daysOfWeek(language?: languages): string[];
    }
}
export declare function DateToStringLocal(date: Date): string;
