import e, * as express from 'express';
import Cconsole from "./Console";
import * as path from "path";
import { User } from "../../src/types/userType";
import {pool,logPool} from "./Postgre";
import { Log, page } from "../../src/types/logType";
const fs = require('fs')
const ffmpeg = require('fluent-ffmpeg')
ffmpeg.setFfmpegPath("D:/Site_anime/ffmpeg/bin/ffmpeg.exe")
ffmpeg.setFfprobePath("D:/Site_anime/ffmpeg/bin/ffprobe.exe")
import {v4 as uuidv4} from "uuid"
import { AnimeUser } from "../../src/types/animeModel";
import { MangaUser } from "../../src/types/mangaType";
import * as bcrypt from "bcrypt"
import * as jwt from "jsonwebtoken"
import * as fss from "fs"
// import { randomInt } from "crypto";





export const Console = Cconsole
// export const epModel = mongoose.model<episode>('aniEp',aniEpS)

export function setHeader(res:express.Response){
    res.setHeader('Content-Security-Policy', 'upgrade-insecure-requests');
}

export function cut(string:string){
    var s:string = string.replace(/[^a-zA-Z0-9-_ ]/g, "")
    return s
}
export async function getTime(path:string){
    try{
        ffmpeg.ffprobe(path,(err:Error,data:any)=>{
            if(err)throw err;else{
                var dur = data.format.duration
                return data.format.duration
            }
        })
    }catch(err){
        return 0
    }
}
export enum ErrorType {
    NotId ,
    Exist ,
    undefined ,
    noToken,
    invalidToken,
    default
}
export function sendError(res:express.Response,errorType:ErrorType = ErrorType.default,status:number = 500,menssage:string = ""){
    function error(res:express.Response,status:number,menssage:string){
        Console.error(menssage)
        res.status(status).json(menssage)
    }
    function notId(res:express.Response){
        Console.error("The ids are not a valid ObjectId or does not exist")
        res.status(400).json("The ids are not a valid ObjectId or does not exist")
    }
    function exist(res:express.Response){
        Console.error("The anime already exists")
        res.status(409).json("The anime already exists")
    }
    function und(res:express.Response){
        Console.error("Is undefined")
        res.status(400).json("Is undefined")
    }
    function noToken(res:e.Response){
        Console.log("No token is provided")
        res.status(401).json({mensagem:"No token is provided"})
    }
    function invalidToken(res:e.Response){
        Console.log("Invalid Token")
        res.status(403).json({mensagem:"Invalid Token"})
    }
    switch(errorType){
        case ErrorType.NotId:
            notId(res)
            break
        case ErrorType.Exist:
            exist(res)
            break
        case ErrorType.undefined:
            und(res)
            break
        case ErrorType.noToken:
            noToken(res)
            break
        case ErrorType.invalidToken:
            invalidToken(res)
            break
        case ErrorType.default:
            error(res,status,menssage)
            break
    }
}
export function sendFile(){
    function cssJs(res:express.Response){
        res.set('Cache-Control','public, max-age=31536000').set('Age','262968')
    }
    function img(res:express.Response){
        res.set('Cache-Control','public, max-age=86400').set('Age','262968')
    }
    return {
        cssJs:cssJs,
        img:img
    }
}

// sendErr.prototype
export async function mkDir(no:String,svData:string){
    var nom = cut(no.toString())
    Console.log(nom)
    try{
        await fs.mkdirSync(path.join(svData,nom,"Seasons"),{recursive:true})
        await fs.mkdirSync(path.join(svData,nom,"Img"),{recursive:true})
        // await checkSeason(data.content.Seasons,svData)
        Console.log("Criado pastas")
    }catch(err){
        Console.error(err)
    }
    
}
export function id(num:number = 8){
    if(!Number.isNaN(num)){
        var buffer = new Uint8Array(num/2)
        crypto.getRandomValues(buffer)
        return Array.from(buffer, byte => byte.toString(16).padStart(2,'0')).join('')
    }else{
        return false
    }    
}

// export async function checkSeason(Seasons:Season[],pathToVid:string){
//     var dirs = await fs.readdir(path.join(pathToVid,"Seasons"))
//     for(let i = 0; i< dirs.length;i++){
//         var pathDir = path.join(pathToVid,"Seasons",dirs[i])
//         // var b = await Seasons.find((e) => e=== dirs[i])
//         var stat = await fs.lstat(pathDir)
//         if(stat.isDirectory()){
//             if(!fs.existsSync(pathDir)){
//                 await fs.mkdir(pathDir)
//             }
//         }
//     }
//     for(let i = 0; i< Seasons.length;i++){
//         var pathDir = path.join(pathToVid, "Seasons", cut(Seasons[i].Name));
//         var b = await fs.exists(pathDir)
//         if(!b){
//             await fs.mkdir(pathDir)
//         }
//     }
//     for(let i = 0;i< dirs.length;i++){
//         var pathDir = path.join(pathToVid, "Seasons", dirs[i])
//         if(fs.existsSync(pathDir)&& !Seasons.some((e)=> e === dirs[i])){
//             fs.removeSync(pathDir)
//         }
//     }
// }

export async function addLog(log:Log){
    const {date,page,duration,ep} = log
    var anime = log.anime?log.anime:""
    var manga = log.manga?log.manga:""

    var _id = uuidv4()
    Console.log([_id,new Date(date).toISOString(),anime,manga,page,duration,ep])
    const result = await logPool.query(
        'INSERT INTO log (date, anime, manga, page, duration, ep) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [new Date(date).toISOString(),anime,manga,page,duration,ep]
    )
    return result.rows[0]
}
interface TokenRequest extends e.Request{
    usuario?:string | jwt.JwtPayload 
}
export async function loginUser(req:e.Request,res:e.Response) {
    
}
export async function checkToken(req:TokenRequest,res:e.Response,next:e.NextFunction) {
    const token = req.headers.authorization;
    const segredo = fss.readFileSync("D:/main/https/token/token.pem")
    if(!token){
        sendError(res,ErrorType.noToken)
        return
    }
    jwt.verify(token,segredo,(err,usuario)=>{
        if(err){
            sendError(res,ErrorType.invalidToken)
            return
        }
        req.usuario = usuario
        next()
    })
}
export async function addUser(user:User):Promise<User>{
    const {name,surname,username,birthDate,email,password} = user
    var _id = uuidv4()
    const totalAnime:number = 0;
    const totalAnimeWatching:number = 0;
    const totalAnimeCompleted:number = 0;
    const totalAnimeDropped:number = 0;
    const totalAnimePlanToWatch:number = 0;
    const totalAnimeLiked:number = 0;
    const totalManga:number = 0;
    const totalMangaReading:number = 0;
    const totalMangaCompleted:number = 0;
    const totalMangaDropped:number = 0;
    const totalMangaPlanToRead:number = 0;
    const totalMangaLiked:number = 0
    const animeList: AnimeUser[] = [];
    const mangaList: MangaUser[] = [];
    var saltRounds = await bcrypt.genSalt()
    var hashedPassword = bcrypt.hashSync(password+saltRounds,saltRounds)
    const result = await pool.query(
        `INSERT INTO public."user" (_id, username, email, password, name, surname, birthdate, totalAnime, totalAnimeWatching, totalAnimeCompleted, totalAnimeDropped, totalAnimePlanToWatch, totalManga, totalMangaReading,totalMangaCompleted, totalMangaDropped, totalMangaPlanToRead, animeList, mangaList, totalAnimeLiked, totalMangaLiked) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21) RETURNING *`,
        [
            _id, username, email, hashedPassword, name, surname, new Date(birthDate).toISOString(),
            totalAnime, totalAnimeWatching, totalAnimeCompleted, totalAnimeDropped, totalAnimePlanToWatch,
            totalManga, totalMangaReading, totalMangaCompleted, totalMangaDropped, totalMangaPlanToRead,
            animeList || [],  // Se animeList for nulo, usa um array vazio
            mangaList || [],  // Se mangaList for nulo, usa um array vazio
            totalAnimeLiked || [],  // Se totalAnimeLiked for nulo, usa um array vazio
            totalMangaLiked || [],   // Se totalMangaLiked for nulo, usa um array vazio,
        ]
    );
    return result.rows[0];
}
