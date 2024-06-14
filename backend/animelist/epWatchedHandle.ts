import {animeClient,logPool} from "../database/Postgre";
import e, {Request, Response} from "express";
import {Season} from "../../src/types/animeModel";
import {tupleToSeason} from "../../src/functions/animeFunctions";
import {JwtUser} from "../types";
import {Episode, EpisodeSim} from "../../src/types/episodeModel";
import {Console, ErrorType, sendError} from "../assets/handle";
import {types} from "cassandra-driver";
import user from "../../src/pages/User/User";

export async function epWatchedHandle(req:Request,res:Response,anime:typeof animeClient,log:typeof logPool) {
    let {aniId, seasonId, epId} = req.params;
    try{
        let ep = (await req.db.execute(`SELECT * FROM episodes WHERE id = ${epId}`)).rows[0]
        Console.log(ep)
        let epResult = await animeClient.query(`
            SELECT * FROM users.user_episode_list WHERE episode_id = $1
        `,[epId])
        if(epResult.rows.length == 0){
            await animeClient.query(`
                INSERT INTO users.user_episode_list (
                    episode_id,
                    dropped_on,
                    season_id,
                    anime_id,
                    user_id,
                    duration
                ) VALUES (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5,
                    $6
                ) RETURNING *;
            `,[
                epId,
                req.body.duration,
                seasonId,
                aniId,
                (req.user as JwtUser)._id,
                ep.duration
            ])
        }else{
            await editEpisode(req.user as JwtUser,aniId,ep,req.body.duration)
        }
        await log.query(`
            INSERT INTO public.log (
                date,
                anime,
                duration,
                ep,
                season
        ) VALUES(
            $1,
            $2,
            $3,
            $4,
            $5
        ) RETURNING TRUE
        `,[
            new Date(Date.now()),
            aniId,
            req.body.duration,
            epId,
            seasonId
        ])
        let result = await animeClient.query(`
            SELECT season_id
                FROM users.user_season_list
                WHERE season_id = $1 AND user_id = $2;
        `,[seasonId,(req.user as JwtUser)._id]);
        if(result.rows.length < 1){
            await addSeason(seasonId,req,ep,aniId)
        }else if(result.rows.length > 1){
            Console.error("fudeo")
            throw result.rows[0]
        }else{
            await editSeason(seasonId,req,aniId,ep)
        }
        return res.status(200).send("Log"+(req.user as JwtUser)._id)
    }catch(e){
        switch (e){
            case ErrorType.default:
                return sendError(res,ErrorType.default,500,e);
                break;
            case ErrorType.undefined:
                return sendError(res,ErrorType.undefined);
                break
            default:
                return sendError(res,ErrorType.default,500,e);
                break
        }
    }

}

export async function addSeason(seasonId:string, req:Request, ep:types.Row, aniId:string){
    try {
        let seasons = tupleToSeason((await req.db.execute(`SELECT seasons FROM anime WHERE id = ${aniId}`)).rows[0].seasons)
        let season = seasons.find(v=>v.id == seasonId)!
        Console.log(season,aniId)
        await animeClient.query(`
                INSERT INTO users.user_season_list (
                    anime_id, season_id, total_episodes, user_id, total_episodes_watched,  total_rewatched_episodes
                ) VALUES($1,$2,$3,$4,$5,$6)
                RETURNING TRUE;
            `,[
                aniId,
                seasonId,
                season.episodes.length,
                (req.user as JwtUser)._id,
                ep.epindex,
                0
        ])
    }catch (e){
        Console.error("Add Season: "+e)
        throw e
    }
}
export async function editSeason(seasonId:string,req:Request,aniId:string,ep:types.Row){
    try {
        let seasons = tupleToSeason((await req.db.execute(`SELECT seasons FROM anime WHERE id = ${aniId}`)).rows[0].seasons)
        let season = seasons.find(v=>v.id == seasonId)!
        Console.log(ep)
        let rewatched = (await animeClient.query(`
            SELECT episode_id,
                   dropped_on,
                   season_id,
                   anime_id,
                   user_id,
                   id,
                   date,
                   duration
            FROM users.user_episode_list
            WHERE user_id = $1
              AND episode_id = $2
              AND season_id = $3
              AND anime_id = $4;
        `, [(req.user as JwtUser)._id, ep.id.toString(), seasonId, aniId])).rows.length == 1

        if(rewatched){
            return await animeClient.query(`
                UPDATE users.user_season_list
                    SET total_rewatched_episodes=$1, 
                    total_episodes_watched=$2
                    WHERE season_id=$3 AND user_id=$4;
            `,[ep.epindex,season.episodes.length,seasonId,(req.user as JwtUser)._id])
        }
        return await animeClient.query(`
            UPDATE users.user_season_list
                SET total_episodes_watched=$1 
                WHERE season_id=$2 AND user_id=$3;
        `,[ep.epindex,seasonId,(req.user as JwtUser)._id])
    }catch (e){
        Console.error(e);
        throw e
    }
}
export async function editEpisode(user:JwtUser,aniId:string,ep:types.Row,mud:number){
    try {
        if(!mud){
            throw ErrorType.undefined
        }
        return await animeClient.query(`
            UPDATE users.user_episode_list 
            SET dropped_on = $1,
                date = now()
            WHERE user_id = $2
            AND episode_id = $3
            AND anime_id = $4
        `,[mud,user._id,ep.id.toString(),aniId])
    }catch (e){
        Console.error("Edit Episode: "+e)
        throw e
    }
}
