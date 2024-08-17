import * as e from "express";
import { pgClient } from "../database/Postgre";
import { Console, ErrorType, sendError, setHeader } from "../assets/handle";

const animeGetRouter = e.Router();
//TODO fazer a database de animes ser o pgsql
//scylla nao tem muitas funções q seriam boas para bom funcionamento da database

//rota para lançamentos (usado para pegar todos os animes)
animeGetRouter.get("/lan" ,async(req,res)=>{
    try{
        setHeader(res)
        res.setHeader("Cache-Control","public, max-age:60")
        //WHERE date_added BETWEEN CURRENT_TIMESTAMP - INTERVAL '7 days' AND CURRENT_TIMESTAMP;
        var query = `SELECT id, name, description, genre, averageeptime FROM anime.anime;`
        res.send((await req.db.query(query)).rows)
    }catch(err){
        Console.error(err)
        sendError(res,ErrorType.undefined)
    }
})
//rota para a agenda de lançamentos
animeGetRouter.get("/agenda",async(req,res)=>{
    try{
        res.send((await req.db.query("SELECT id, name, description,rating, weekday FROM anime.anime WHERE state = 'Lançando'")).rows)
    }catch(err){
        sendError(res,ErrorType.default,500,err)
    }
})
//rota para pegar os produtores, criadores, studios
animeGetRouter.get('/prods/:id',async(req,res)=>{
    try{
        let animeid = req.params.id
        let prod = await (await req.db.query(`
            WITH producer_ids AS (
                SELECT UNNEST(producers) AS producer_id
                FROM anime.anime
                WHERE id = $1
            )
            SELECT p.id, p.name
            FROM producer_ids pi
            JOIN anime.producers p ON pi.producer_id = p.id;
        `,[animeid])).rows
        let cria = await (await req.db.query(`
            WITH producer_ids AS (
                SELECT UNNEST(creators) AS producer_id
                FROM anime.anime
                WHERE id = $1
            )
            SELECT p.id, p.name
            FROM producer_ids pi
            JOIN anime.creators p ON pi.producer_id = p.id;
        `,[animeid])).rows
        let stud = await (await req.db.query(`
            WITH producer_ids AS (
                SELECT UNNEST(studios) AS producer_id
                FROM anime.anime
                WHERE id = $1
            )
            SELECT p.id, p.name
            FROM producer_ids pi
            JOIN anime.studios p ON pi.producer_id = p.id;
        `,[animeid])).rows
        res.send({
            producers:prod,
            creators:cria,
            studios:stud
        })
    }catch(err){
        sendError(res,ErrorType.default,500,err)
    }
})
//rota para pegar seasons de um anime
animeGetRouter.get("/seasons/:id",async(req,res)=>{
    try{
        res.send((await req.db.query(`SELECT * FROM anime.seasons WHERE anime_id = $1`,[req.params.id])).rows)
    }catch(err){
        sendError(res,ErrorType.default,500,err)
    }
})
//rota para pegar animes de acordo com o genero
animeGetRouter.get("/gen/:gen",async(req,res)=>{
    try{
        res.send((await req.db.query(`SELECT id, name, description, rating FROM anime.anime WHERE EXISTS (
            SELECT 1 
            FROM unnest(genre) AS g 
            WHERE g LIKE $1
        );`,[`%${req.params.gen}%`])).rows)
    }catch(err){
        sendError(res,ErrorType.default,500,err)
    }
})
//rota para pegar animes de acordo com os produtores
animeGetRouter.get("/prod/:prod",async(req,res)=>{
    try{
        res.send((await req.db.query(`SELECT id, name, description, rating 
        FROM anime.anime 
        WHERE $1::uuid = ANY(producers)`,[req.params.prod])).rows)
    }catch(err){
        sendError(res,ErrorType.default,500,err)
    }
})
//rota para pegar animes de acordo com os criadores
animeGetRouter.get("/crea/:cria",async(req,res)=>{
    try{
        res.send((await req.db.query(`SELECT id, name, description, rating 
            FROM anime.anime 
            WHERE $1::uuid = ANY(creators)`,[req.params.cria])).rows)
    }catch(err){
        sendError(res,ErrorType.default,500,err)
    }
})
//rota para pegar animes de acordo com os produtores
animeGetRouter.get("/stud/:stud",async(req,res)=>{
    try{
        res.send((await req.db.query(`SELECT id, name, description, rating 
            FROM anime.anime 
            WHERE $1::uuid = ANY(studios)`,[req.params.stud])).rows)
    }catch(err){
        sendError(res,ErrorType.default,500,err)
    }
})
//rota para pesquisar anime pelo nome (FUNCIONANDO)
animeGetRouter.get("/search/:s",async(req,res)=>{
    try{
        var s = req.params.s
        // Console.log(s)
        res.send((await req.db.query(`SELECT id, name, description, rating FROM anime.anime WHERE name ILIKE $1 OR name2 ILIKE $1`,[`%${s}%`])).rows)
    }catch(err){
        sendError(res,ErrorType.default,500,err)
    }
})
//rota para pegar anime
//esse sempre em ultimo nas rotas
animeGetRouter.get("/:id",async(req,res)=>{
    try{
        res.send((await req.db.query(`SELECT id, averageeptime, date_added, description, genre, language, name, name2, quality, rating, weekday, state, releasedate
	FROM anime.anime WHERE id = $1;`,[req.params.id])).rows[0])
    }catch(err){
        sendError(res,ErrorType.NotId)
    }
})


export default animeGetRouter;