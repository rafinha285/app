import { Episode, languages } from "../types/episodeModel";
export declare function getEpTime(ee: number): string;
export declare function trim(string: String, maxLength?: number): string;
export declare const getMonthName: (date: Date, short: boolean, locale?: string) => string;
export declare function handleEpWatched(ani: string, seasonId: string, ep: Episode): Promise<void>;
export declare const handleNextEp: (ani: string, seasonId: string, eps: Episode[], index: number, isLogged: boolean) => void;
export declare function nextEpUrl(eps: Episode[], ani: string, ep: Episode): string | undefined;
export declare function prevEpUrl(eps: Episode[], ani: string, ep: Episode): string | undefined;
declare global {
    interface Date {
        getDayOfWeekName(): string;
        daysOfWeek(language?: languages): string[];
    }
}
export declare function DateToStringInput(dat: Date): string;
export declare function DateToStringLocal(dat: Date): string;
export declare function checkIsLogged(isLogged: boolean): void;
