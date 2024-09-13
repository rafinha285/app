import {AnimeUser} from '../../src/types/animeModel'
import { EpisodeUser } from '../../src/types/episodeModel';
import { priorityValue, userAnimeState } from '../../src/types/types';
import { pgClient } from '../../backend/database/Postgre'
import e from 'express';
import { AnimelistEmitter } from '../routes/animelistRoutes';
// export class UserAnimeList implements AnimeUser{
//     user_id: string;
//     id: number;
//     anime_id: string;
//     name: string;
//     start_date?: Date;
//     finish_date?: Date;
//     rate: number;
//     status: userAnimeState;
//     priority: priorityValue;
//     last_ep: EpisodeUser[];

//     constructor(
//         user_id:string,
//         id: number,
//         anime_id: string,
//         name: string,
//         rate: number,
//         status: userAnimeState,
//         priority: priorityValue,
//         last_ep: EpisodeUser[],
//         start_date?: Date,
//         finish_date?: Date
//     ) {
//         this.user_id = user_id;
//         this.id = id;
//         this.anime_id = anime_id;
//         this.name = name;
//         this.rate = rate;
//         this.status = status;
//         this.priority = priority;
//         this.last_ep = last_ep;
//         this.start_date = start_date;
//         this.finish_date = finish_date;
//     }
//     async save():Promise<void> {
//         let con = await pgClient.connect()
//         try{
//             await con.query(`INSERT INTO users.user_anime_list
//                 (
//                     user_id,
//                     anime_id,
//                     status,
//                     name,
//                     start_date,
//                     finish_date,
//                     rate,
//                     priority,
//                 ) VALUES (
//                     $1
//                     $2
//                     $3
//                     $4
//                     $5
//                     $6
//                     $7
//                     $8
//                 )
//             `,[
//                 this.user_id,
//                 this.anime_id,
//                 this.status,
//                 this.start_date,
//                 this.finish_date,
//                 this.rate,
//                 this.priority,
//             ])
//         }catch(err){
//             con.query("ROLLBACK")
//             throw err
//         }finally{
//             con.release()
//         }
//     }
// }
AnimelistEmitter.on('updateNumbers',async(e)=>await updateAnimelistNumbers(e))
// AnimelistEmitter.on('insert',async(e)=>await updateAnimelistNumbers(e))

export async function updateAnimelistNumbers(userId:string):Promise<void>{
    try{
        // Consultas para contar os diferentes tipos de animes
        const totalAnimeResult = await pgClient.query(`
            SELECT COUNT(*) as total 
            FROM users.user_anime_list 
            WHERE user_id = $1
        `, [userId]);

        const watchingResult = await pgClient.query(`
            SELECT COUNT(*) as watching 
            FROM users.user_anime_list 
            WHERE status = 'watching' AND user_id = $1
        `, [userId]);

        const completedResult = await pgClient.query(`
            SELECT COUNT(*) as completed 
            FROM users.user_anime_list 
            WHERE status = 'completed' AND user_id = $1
        `, [userId]);

        const droppedResult = await pgClient.query(`
            SELECT COUNT(*) as dropped 
            FROM users.user_anime_list 
            WHERE status = 'dropped' AND user_id = $1
        `, [userId]);

        const planToWatchResult = await pgClient.query(`
            SELECT COUNT(*) as plantowatch 
            FROM users.user_anime_list 
            WHERE status = 'plan_to_watch' AND user_id = $1
        `, [userId]);

        // Extraindo os valores das consultas
        const totalAnime = totalAnimeResult.rows[0].total;
        const watching = watchingResult.rows[0].watching;
        const completed = completedResult.rows[0].completed;
        const dropped = droppedResult.rows[0].dropped;
        const planToWatch = planToWatchResult.rows[0].plantowatch;
        console.log([totalAnime, watching, completed, dropped, planToWatch, userId])
        await pgClient.query(`
            UPDATE users.users
            SET totalanime = $1, totalanimewatching = $2, totalanimecompleted = $3, totalanimedropped = $4, totalanimeplantowatch = $5
            WHERE id = $6
        `, [totalAnime, watching, completed, dropped, planToWatch, userId]);
    }catch(err){
        throw err;
    }
}