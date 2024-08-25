import {AnimeUser} from '../../src/types/animeModel'
import { EpisodeUser } from '../../src/types/episodeModel';
import { priorityValue, userAnimeState } from '../../src/types/types';
import { pgClient } from '../../backend/database/Postgre'
export class UserAnimeList implements AnimeUser{
    user_id: string;
    id: number;
    anime_id: string;
    name: string;
    start_date?: Date;
    finish_date?: Date;
    rate: number;
    status: userAnimeState;
    priority: priorityValue;
    last_ep: EpisodeUser[];

    constructor(
        user_id:string,
        id: number,
        anime_id: string,
        name: string,
        rate: number,
        status: userAnimeState,
        priority: priorityValue,
        last_ep: EpisodeUser[],
        start_date?: Date,
        finish_date?: Date
    ) {
        this.user_id = user_id;
        this.id = id;
        this.anime_id = anime_id;
        this.name = name;
        this.rate = rate;
        this.status = status;
        this.priority = priority;
        this.last_ep = last_ep;
        this.start_date = start_date;
        this.finish_date = finish_date;
    }
    async save():Promise<void> {
        let con = await pgClient.connect()
        try{
            await con.query(`INSERT INTO users.user_anime_list
                (
                    user_id,
                    anime_id,
                    status,
                    name,
                    start_date,
                    finish_date,
                    rate,
                    priority,
                ) VALUES (
                    $1
                    $2
                    $3
                    $4
                    $5
                    $6
                    $7
                    $8
                )
            `,[
                this.user_id,
                this.anime_id,
                this.status,
                this.start_date,
                this.finish_date,
                this.rate,
                this.priority,
            ])
        }catch(err){
            con.query("ROLLBACK")
            throw err
        }finally{
            con.release()
        }
    }
}