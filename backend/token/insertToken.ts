import * as e from "express";
import { JwtUser } from "../types";
import * as jwt from 'jsonwebtoken'
import { secretKey } from "../secret/config";
export default async function insertToken(req:e.Request,user:{
    _id:string,
    username:string,
    user_agent:string,
    time_zone:string,
    web_gl_vendor:string,
    web_gl_renderer:string,
}):Promise<string>{
    try{
        const expires_at = new Date()
        expires_at.setDate(expires_at.getDate()+7)
        let result = await req.db.query(`INSERT INTO users.users_sessions (
                user_id, expires_at, user_agent, time_zone, web_gl_vendor, web_gl_renderer
            ) VALUES ($1, $2, $3, $4, $5, $6) 
            RETURNING *`
        ,[user._id,expires_at,user.user_agent,user.time_zone,user.web_gl_vendor,user.web_gl_renderer])
        if(result.rows.length !== 0){
            let jwtToken = jwt.sign(user,secretKey,{'expiresIn':"7 days"})
            return jwtToken
        }else{
            throw new Error("Erro ao iniciar sessão")
        }
    }catch(err){
        throw err
    }
}