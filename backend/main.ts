import * as e from 'express'
import * as path from 'path'
import * as fs from 'fs'
import * as http from 'http'
import {types} from 'cassandra-driver'
import { Console, ErrorType, sendError, sendFile } from "./assets/handle"
import {json, urlencoded} from "body-parser"
import * as cookieParser from "cookie-parser"
import userPostRouter from './routes/userPostRoutes'
import { client } from './database/pool'
import userGetRouter from './routes/userGetRoutes'
import { BUILD_HTML, BUILD_PATH } from './consts'
import { pgClient } from './database/Postgre'
import * as pg from "pg"
import animeGetRouter from './routes/animeGetRoutes'
import animeListRouter from './routes/animelistRoutes'
import episodesGetRouter from './routes/episodesgetRoutes'

const app = e()

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser())

pg.defaults.poolSize = 5

app.use(async (req,res,next)=>{
    // client.connect()
    //     .then(()=>{
    //         req.db = client;
    //         next()
    //     })
    //     .catch(err=>{
    //         Console.error(err);
    //         sendError(res,ErrorType.default,500,"Erro na database");
    //     })
    // pgClient.connect().then((v)=>{
    //     req.db = v
    //     next()
    // }).catch(err=>{
    //     Console.error(err);
    //     sendError(res,ErrorType.default,500,"Erro na database");
    // })
    req.db = pgClient
    next()
})


//rotas para usuario
app.use('/user/p/',userPostRouter)
app.use('/user/g/',userGetRouter)
//rotas para animelist
app.use('/user/animelist',animeListRouter)
//rotas para anime
app.use('/ani/g/',animeGetRouter)
//rotas para episodios
app.use('/ep/g/',episodesGetRouter)
//rotas para o log de eps assistidos


app.use(e.static(BUILD_PATH,{ maxAge: '1d' }))
//kkkkkk risos risos risonho
app.get('/easteregg',async(req,res)=>{
    res.redirect('https://youtu.be/xvFZjo5PgG0?si=UNy9hc1yJFPGlSz-')
})
//para q todos os requests
app.get('*',(req:e.Request,res:e.Response)=>{
    sendFile().cssJs(res)
    res.sendFile(BUILD_HTML)
})

app.listen(4433,'0.0.0.0',()=>{
    Console.log(`http://0.0.0.0:4433`)
})