import * as e from "express";
import { addUser, Console, ErrorType, sendError } from "../assets/handle";
import { reCaptchaSecretKey } from "../secret/config";
import { pgClient } from "../database/Postgre";
import { JwtUser } from "../types";
import * as jwt from "jsonwebtoken"
import * as fs from 'fs'
import * as path from 'path'
// import * as crypto from 'crypto'
import * as NodeRSA from 'node-rsa'

const userPostRouter = e.Router()
const privateKey = fs.readFileSync(path.join(__dirname,'../','secret','private_key_decrypted.pem'), 'utf8');
const key = new NodeRSA(privateKey);
function decryptData(encryptedData:string) {
    Console.log(privateKey)
    key.decrypt(encryptedData,'utf8')
}

userPostRouter.post("/login",async(req:e.Request,res:e.Response)=>{
    try{
        console.log(req.body.encryptedData)
        console.log(decryptData(req.body.encryptedData))
        const {email,password,recaptchaToken} = req.body;
        if(!recaptchaToken){
            throw ErrorType.invalidReCaptcha
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
            let tokenInfo:JwtUser ={
                _id:result.rows[0]._id,
                username:result.rows[0].username,
                UserAgent:req.get("User-Agent")!,
                ip:req.socket.remoteAddress!,
                // SecChUa:req.get("Sec-Ch-Ua")!
            }
            // const token = jwt.sign(tokenInfo,await importPrivateKey(),{expiresIn:"1d"})
            // res.cookie('token',token,{httpOnly:true,secure:true})
            // res.send({success:true,message:"Login Successful",token})
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
        let tokenInfo:JwtUser ={
            _id:result.rows[0]._id,
            username:result.rows[0].username,
            UserAgent:req.get("User-Agent")!,
            ip:req.socket.remoteAddress!,
            // SecChUa:req.get("Sec-Ch-Ua")!
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
        res.clearCookie('token')
        res.json({success:true,message:"Logout successful"})
    }catch(err){
        sendError(res,ErrorType.default,500,err)
    }

})
//Rota para criar um usuario novo
userPostRouter.post('/new/user',async(req,res)=>{
    try{
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
            let userData = {
                name,
                email,
                surname,
                username,
                birthDate,
                password,
                salt
            }
            await addUser(userData)
            return res.send(200).json({success:true,message: 'Usuário registrado com sucesso' })
        }else{
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