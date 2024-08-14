import { priorityValue, userAnimeState } from '../../src/types/types';
interface inserProps {
    user_id: string;
    anime_id: string;
    status: userAnimeState;
    start_date: Date;
    finish_date?: Date;
    rate?: number;
    priority?: priorityValue;
}
export declare function addAnimeToAnimeList({ user_id, anime_id, status, start_date, finish_date, rate, priority }: inserProps): Promise<void>;
export {};
