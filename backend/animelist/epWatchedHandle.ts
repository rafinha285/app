import {animeClient, logPool} from "../database/Postgre";
import {Request, Response} from "express";
import {Anime, animeListStatus, Season} from "../../src/types/animeModel";
import {tupleToSeason} from "../../src/functions/animeFunctions";
import {JwtUser} from "../types";
import {Episode, EpisodeSim, EpisodeUser} from "../../src/types/episodeModel";
import {Console, ErrorType, sendError} from "../assets/handle";
import {types} from "cassandra-driver";
import { QueryResult } from "pg";
import { JwtPayload } from "jsonwebtoken";
import * as pg from 'pg'
//TODO fazer ele checar se o anime ja existe no animeList
//se nao existir adicionar
//se tiver update

//^feito

//TODO fazer ele checar se ja existe o ep no episode list
//se nao existir adicionar
//se tiver update

//TODO fazer ele adicionar ao log o ep

//TODO deletar o last_ep da anime list
export async function epWatchedHandle(req:Request,res:Response,animeC:typeof animeClient,log:typeof logPool,user:string | JwtUser | JwtPayload | undefined) {
    let {aniId, seasonId, epId} = req.params;
    let {droppedOn, duration, ep_index,watched}= req.body
    try{
        if(!aniId||!seasonId||!epId){
            throw ErrorType.undefined;
        }
        if(!user){
            throw ErrorType.unauthorized;
        }
        let anime = (await req.db.execute(`SELECT name, id FROM anime WHERE id = ?`,[aniId])).rows[0]
        console.log(anime)
        //Checa se o anime existe na lista do individuo hehe
        Console.log(user)
        let animeCheck = await checkAnimeList(user as JwtUser,aniId,animeC)
        Console.log(animeCheck)
        if(animeCheck){
            //Atualiza o estado do anime para assistindo
            await animeC.query(`
                UPDATE users.user_anime_list
                    SET status='watching'
                    WHERE user_id = $1 AND anime_id = $2;
            `,[(user as JwtUser)._id,aniId])
            
        }else{
            Console.log("inseri")
            //Coloca na lista o anime do episodio q foi assistido
            await insertAnimeList(animeC,anime,(user as JwtUser),animeListStatus.watching)
        }
        let epCheck = await checkEpList((user as JwtUser),aniId,epId,animeC)
        Console.log(epCheck)
        if(epCheck){
            //Modifica o ep na database
            if(watched){
                await animeC.query(`
                    UPDATE users.user_episode_list
                        SET dropped_on = $1,
                        date = now(),
                        watched = TRUE
                    WHERE user_id = $2 AND anime_id = $3 AND episode_id = $4;
                `,[duration,(user as JwtUser)._id,aniId,epId])
            }else{
                await animeC.query(`
                    UPDATE users.user_episode_list
                        SET dropped_on = $1,
                            date = now(),
                            watched = FALSE
                        WHERE user_id = $2 AND anime_id = $3 AND episode_id = $4;
                `,[droppedOn,(user as JwtUser)._id,aniId,epId])
            }
        }else{
            await insertEpList(animeC,aniId,seasonId,epId,droppedOn,ep_index,duration,(user as JwtUser),watched);
        }
        // await log.query(`
        //     INSERT INTO log (date, anime, page, duration, ep, season)
        //     VALUES (
        //         now(),
        //         $1,
        //         'watch',
        //         $2,
        //         $3,
        //         $4
        //       );
        // `,[aniId,duration,epId,seasonId])
        res.send({success:true,message:"Log adicionado para user"+(user as JwtUser).username})
    }catch(e){
        switch (e){
            case ErrorType.default:
                return sendError(res,ErrorType.default,500,e);
            case ErrorType.undefined:
                return sendError(res,ErrorType.undefined);
            case ErrorType.unauthorized :
                return sendError(res,ErrorType.unauthorized);
            default:
                return sendError(res,ErrorType.default,500,e);
        }
    }

}

//TODO update da season com o epIndex
//^salvar o episodio para a season pelo epindex e nao pelo id

//Checa se o anime esta na lista
export async function checkAnimeList(user:JwtUser,animeId:string,animeC:typeof animeClient):Promise<boolean>{
    let checkAnime = await animeC.query(`
        SELECT name FROM users.user_anime_list WHERE anime_id = $1 AND user_id = $2;
    `,[animeId,user._id])
    return (checkAnime.rowCount!) > 0;
}
//Checa se o ep esta na lista
export async function checkEpList(user:JwtUser,animeId:string,epId:string,animeC:typeof animeClient):Promise<boolean>{
    let checkEp = await animeC.query(`
        SELECT ep_index FROM users.user_episode_list WHERE anime_id = $1 AND user_id=$2 AND episode_id=$3;
    `,[animeId,user._id,epId])
    return (checkEp.rowCount!) > 0;
}
//Coloca anime na lista de anime
export async function insertAnimeList(animeC:typeof animeClient,anime:any,user:JwtUser,status:animeListStatus){
    try{
        Console.log(anime.id.toString(),user)
        pg.Query
        await animeC.query(`
            insert into users.user_anime_list (user_id, anime_id, status, name, start_date)
            values ($1,$2,$3,$4,now());
        `,[user._id,anime.id.toString(),'watching',anime.name])
    }catch(err){
        throw err;
    }
}
//Coloca o ep na lista
export async function insertEpList(
    animeC:typeof animeClient,
    animeId:string,
    seasonId:string,
    epId:string,
    droppedOn:number,
    epIndex:number,
    duration:number,
    user:JwtUser,
    watched:boolean
):Promise<void>{
    try{
        await animeC.query(`
            INSERT INTO 
                users.user_episode_list 
                (episode_id,dropped_on,season_id,anime_id,user_id,date,duration,ep_index,watched)
            VALUES
                ($1,$2,$3,$4,$5,now(),$6,$7,$8)
        `,[
            epId,
            droppedOn,
            seasonId,
            animeId,
            user._id,
            duration,
            epIndex,
            watched
        ])
        // return true
    }catch(err){
        throw err;
    }
}
export async function getAllEpsList(animeId:string,seasonId:string,user:JwtUser,animeC:typeof animeClient):Promise<QueryResult<EpisodeUser[]>>{
    return await animeC.query(`
        SELECT * FROM users.user_episode_list
            WHERE user_id = $1 AND anime_id = $2 AND season_id = $3
    `,[user._id,animeId,seasonId])

}
