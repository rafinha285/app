// @ts-ignore
import { reCaptchaSecretKey } from "../secret/config";
import * as e from "express";
import { addUser, Console, ErrorType, sendError } from "../assets/handle";
import { pgClient } from "../database/Postgre";
import {v4 as uuidv4} from "uuid"
import insertToken from "../token/insertToken";
import deleteToken from "../token/deleteToken";

const userPostRouter = e.Router()

userPostRouter.post("/login",async(req:e.Request,res:e.Response)=>{
    try{
        console.log(typeof ErrorType)
        // console.log(decryptData(req.body.encryptedData))
        const {email,password,recaptchaToken,userAgent,timeZone,WebGLVendor,WebGLRenderer} = req.body;
        // if(!recaptchaToken){
        //     throw ErrorType.invalidReCaptcha
        // }
        const response = await fetch('https://www.google.com/recaptcha/api/siteverify',{
            method:"POST",
            headers:{
                'Content-Type':'application/x-www-form-urlencoded',
            },
            body: `secret=${reCaptchaSecretKey}&response=${recaptchaToken}`
        })
        const data = await response.json()
        if(data.success){
            let result = await pgClient.query(`
                WITH hashed_password AS (
                    SELECT users.crypt($1, salt) AS hash
                    FROM users.users
                    WHERE email = $2
                )
                SELECT * FROM users.users
                WHERE email = $2 AND password = (SELECT hash FROM hashed_password)
                `,[password,email])
            // Console.log(result.rows)
            if(result.rows.length < 1){
                throw ErrorType.invalidPassOrEmail
            }
            let tokenInfo ={
                _id:result.rows[0]._id,
                username:result.rows[0].username,
                user_agent:userAgent,
                time_zone:timeZone,
                web_gl_vendor:WebGLVendor,
                web_gl_renderer:WebGLRenderer,
            }
            const token = await insertToken(req,tokenInfo)
            // const token = jwt.sign(tokenInfo,await importPrivateKey(),{expiresIn:"1d"})
            res.cookie('token',token,{httpOnly:true,secure:true})
            res.send({success:true,message:"Login Successful",token})
        }else{
            throw ErrorType.invalidReCaptcha
        }
    }catch(err){
        switch(err){
            case ErrorType.invalidReCaptcha:
                sendError(res,ErrorType.invalidReCaptcha)
                break
            case ErrorType.invalidToken:
                sendError(res,ErrorType.invalidToken)
                break
            case ErrorType.noToken:
                sendError(res,ErrorType.noToken)
                break
            case ErrorType.invalidPassOrEmail:
                sendError(res,ErrorType.invalidPassOrEmail)
                break
            default:
                sendError(res,ErrorType.default,500,err)
                break
        }
    }
})
//TODO colocar o recaptcha no app
//nao da pra deixar essa requisição sem segurança aberta assim
//terminar como o sistema de cima
userPostRouter.post('/app/login',async(req:e.Request,res:e.Response)=>{
    try{
        const {email,password} = req.body;
        let result = await pgClient.query(`
            WITH hashed_password AS (
                SELECT users.crypt($1,salt) AS hash
                FROM users.users
                WHERE email = $2
            )
            SELECT * FROM users.users
            WHERE email = $2 AND password = (SELECT hash FROM hashed_password)
        `,[password,email])
        // Console.log(result.rows)
        if(result.rows.length < 1){
            throw ErrorType.invalidPassOrEmail
        }
        // const token = jwt.sign(tokenInfo,secretKey,{expiresIn:"1d"})
        // res.cookie('token',token,{httpOnly:true,secure:true})
        // res.send({success:true,message:"Login Successful",token})
    }catch(err){
        switch(err){
            case ErrorType.invalidToken:
                sendError(res,ErrorType.invalidToken)
                break
            case ErrorType.noToken:
                sendError(res,ErrorType.noToken)
                break
            case ErrorType.invalidPassOrEmail:
                sendError(res,ErrorType.invalidPassOrEmail)
                break
            default:
                sendError(res,ErrorType.default,500,err)
                break
        }
    }
})
//Rota para deslogar o cliente
userPostRouter.post('/logout',async(req,res)=>{
    try{
        //TODO fazer um jeito de o jwt destruir o token quando ele sai pelo logout
        // provavelmente mais facil e seguro fazer no pg, tem q ver se nao vai usar muita memoria para isso
        await deleteToken(req)
        Console.log('logout',req.user)
        res.clearCookie('token')
        res.json({success:true,message:"Logout successful"})
    }catch(err){
        sendError(res,ErrorType.default,500,err)
    }

})
//Rota para criar um usuario novo
userPostRouter.post('/new/user',async(req,res)=>{
    try{
        Console.log(req.body)
        const { email, name, surname, username, birthDate, password, recaptchaToken, salt } = req.body;
        if(!recaptchaToken){
            throw ErrorType.noToken
        }
        const emailRegex = /\S+@\S+\.\S+/;
        if(!emailRegex.test(email)){
            throw ErrorType.invalidEmail
        }
        const response = await fetch('https://www.google.com/recaptcha/api/siteverify',{
            method:"POST",
            headers:{
                'Content-Type':'application/x-www-form-urlencoded',
            },
            body: `secret=${reCaptchaSecretKey}&response=${recaptchaToken}`
        })
        const data = await response.json()
        if(data.success){
            var _id = uuidv4()
            const totalAnime:number = 0;
            const totalAnimeWatching:number = 0;
            const totalAnimeCompleted:number = 0;
            const totalAnimeDropped:number = 0;
            const totalAnimePlanToWatch:number = 0;
            const totalAnimeOnHold = 0;
            const totalAnimeLiked:number = 0;
            const totalManga:number = 0;
            const totalMangaReading:number = 0;
            const totalMangaCompleted:number = 0;
            const totalMangaDropped:number = 0;
            const totalMangaPlanToRead:number = 0;
            const totalMangaOnHold = 0
            const totalMangaLiked:number = 0
            Console.log([
                _id, username, email, password, name, surname, new Date(birthDate).toISOString(),
                totalAnime, totalAnimeWatching, totalAnimeCompleted, totalAnimeDropped, totalAnimePlanToWatch,
                totalManga, totalMangaReading, totalMangaCompleted, totalMangaDropped, totalMangaPlanToRead,
                totalAnimeLiked || [],  // Se totalAnimeLiked for nulo, usa um array vazio
                totalMangaLiked || [],   // Se totalMangaLiked for nulo, usa um array vazio,
                salt,
                totalAnimeOnHold,
                totalMangaOnHold
            ])
            const result = await pgClient.query(
                `INSERT INTO users.users 
                (
                    _id, 
                    username, 
                    email, 
                    password, 
                    name, 
                    surname, 
                    birthdate, 
                    totalanime, 
                    totalanimewatching, 
                    totalanimecompleted, 
                    totalanimedropped, 
                    totalanimeplantowatch, 
                    totalmanga, 
                    totalmangareading,
                    totalmangacompleted, 
                    totalmangadropped, 
                    totalmangaplantoread, 
                    totalAnimeLiked, 
                    totalMangaLiked,
                    salt,
                    totalanimeonhold,
                    totalmangaonhold
                ) 
                VALUES 
                (
                    $1, 
                    $2, 
                    $3, 
                    $4, 
                    $5, 
                    $6, 
                    $7, 
                    $8, 
                    $9, 
                    $10, 
                    $11, 
                    $12, 
                    $13, 
                    $14, 
                    $15, 
                    $16, 
                    $17, 
                    $18, 
                    $19, 
                    $20, 
                    $21,
                    $22
                ) RETURNING *`,
                [
                    _id, username, email, password, name, surname, new Date(birthDate).toISOString(),
                    totalAnime, totalAnimeWatching, totalAnimeCompleted, totalAnimeDropped, totalAnimePlanToWatch,
                    totalManga, totalMangaReading, totalMangaCompleted, totalMangaDropped, totalMangaPlanToRead,
                    totalAnimeLiked || [],  // Se totalAnimeLiked for nulo, usa um array vazio
                    totalMangaLiked || [],   // Se totalMangaLiked for nulo, usa um array vazio,
                    salt,
                    totalAnimeOnHold,
                    totalMangaOnHold
                ]
            );
            Console.log(result)
            if(result.rows.length !== 0){
                res.status(200).json({success:true,message: 'Usuário registrado com sucesso' })
            }else{
                throw "Erro ao criar a conta"
            }
        }else{
            Console.log("GAY")
            throw ErrorType.invalidReCaptcha
        }
    }catch(err:any|ErrorType){
        switch(err){
            case ErrorType.noToken:
                sendError(res,ErrorType.noToken);
                break
            case ErrorType.invalidToken:
                sendError(res,ErrorType.invalidReCaptcha)
                break
            case ErrorType.invalidEmail:
                sendError(res,ErrorType.invalidEmail)
                break
            default:
                sendError(res,ErrorType.default,500,err)
        }
    }
})

export default userPostRouter
