import * as e from "express";
import { ErrorType, sendError, setHeader } from "../assets/handle";
import { pgClient } from "../database/Postgre";
import sleep from "sleep-promise";
import * as path from "path";
import { ANIME_PATH } from "../consts";

const episodesGetRouter = e.Router();
//rota para pegar um episodio
episodesGetRouter.get('/ep/:animeId/:seasonId/:epId',async(req,res)=>{
    try{
        if(!req.params.animeId || !req.params.seasonId||!req.params.epId){
            throw ErrorType.undefined
        }
        let {animeId,seasonId,epId} = req.params
        // var ep = await pgClient.query("SELECT * FROM episodes WHERE animeid =  AND seasonid = ? AND id = ? ALLOW FILTERING;",[req.params.animeId,req.params.seasonId,req.params.ep],{prepare:true})
        let ep = await req.db.query("SELECT * FROM episodes WHERE anime_id = $1 AND season_id = $2 AND id = $3",[animeId,seasonId,epId])
        res.send(ep.rows[0])
    }catch(err){
        switch(err){
            case ErrorType.undefined:
                sendError(res,ErrorType.undefined,400,"")
                break
            default:
                sendError(res,ErrorType.default,500,err)
        }
    }
})
//rota para pegar todos os eps de uma season
episodesGetRouter.get("/season/:animeid/:seasonid",async(req,res)=>{
    try{
        const {animeid,seasonid} = req.params
        var result = await req.db.query(`SELECT * FROM anime.episodes WHERE season_id = $1 AND anime_id = $2;`,[seasonid,animeid])
        if(result.rows.length === 0){
            throw ErrorType.NotId
        }
        await sleep(50)
        // Console.log(result.rows)
        res.send(result.rows)
    }catch(err){
        switch(err){
            case ErrorType.NotId:
                sendError(res,ErrorType.NotId)
                break
            default:
                sendError(res,ErrorType.default,500,err)
        }
        
    }
})
//Rota para pegar os episódios q lançaram na semana
episodesGetRouter.get('/lan',async(req,res)=>{
    try{
        var {count} = req.query
        res.send((await req.db.query(`
            SELECT 
                a.name AS animename,
                s.name AS seasonname,
                e.name,
                e.id,
                e.anime_id,
                e.season_id,
                e.duration,
                e.resolution,
                e.date_added
            FROM 
                anime.episodes e
            JOIN 
                anime.seasons s ON e.season_id = s.id
            JOIN 
                anime.anime a ON s.anime_id = a.id 
            WHERE 
                e.date_added >= NOW() - INTERVAL '7 days'
            ORDER BY 
                e.date_added DESC
            LIMIT $1;
        `,[count])).rows)
    }catch(err){
        sendError(res,ErrorType.default,500,err)
    }
})
//rota para pegar a legenda
//nao sei pq n da pra pegar do cdn entao tem q fazer essa maracutaia,
//tomara q n adicione mt peso em cima do backend
episodesGetRouter.get('/caption/:aniid/:seasonid/:epid/:lang',(req,res)=>{
    try{
        setHeader(res)
        let {aniid,seasonid,epid,lang} = req.params
        res.set('Cache-Control','public, max-age=7200')
        let epPath = path.join(ANIME_PATH,aniid,'seasons',seasonid,epid,`${epid}-${lang}.vtt`)
        res.sendFile(epPath)
    }catch(err){
        sendError(res,ErrorType.default,500,err)
    }
})


export default episodesGetRouter