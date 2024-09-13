import * as e from "express";
import * as jwt from 'jsonwebtoken'
import { secretKey } from "../secret/config";
import { Console, ErrorType, sendError } from "../assets/handle";
import { JwtUser } from "../types";
import { pgClient } from "../database/Postgre";
import deleteToken from "./deleteToken";
export async function checkToken(req:e.Request,res:e.Response,next:e.NextFunction){
    try{
        //TODO fazer o site mandar o                 
        //AND user_agent = $2 
        // AND time_zone = $3 
        // AND web_gl_vendor = $4 
        // AND web_gl_renderer = $5 
        // para ver se é o usuario de mesmo token
        const { timezone, webglrenderer, webglvendor } = req.headers;
        const userAgent = req.headers['user-agent']
        const tokenHeader = req.headers.authorization?.split(" ")[1];
        const tokencookie = req.cookies.token
        const token = tokenHeader || tokencookie;
        // console.log(req.headers)
        // console.log(userAgent)
        // console.log(timezone, webglrenderer, webglvendor)
        if(!(timezone||webglrenderer||webglvendor||userAgent)){
            return sendError(res,ErrorType.noToken)
        }
        if(!token){
            return sendError(res,ErrorType.noToken)
        }
        let jwtResult;
        try {
            jwtResult = jwt.verify(token, secretKey);
        } catch (err) {
            // Captura erros do JWT, como tokens inválidos ou expirados
            return sendError(res,ErrorType.invalidToken);
        }
        const user = jwtResult as JwtUser;
        let result = await pgClient.query(`
            SELECT expires_at
                FROM users.users_sessions
                WHERE user_id = $1
                AND user_agent = $2 
                AND time_zone = $3 
                AND web_gl_vendor = $4 
                AND web_gl_renderer = $5 
        `,[user._id,userAgent,timezone,webglvendor,webglrenderer])
        // console.log(result)
        // Console.log(parseInt(result.rows[0].count) === 0)
        if(result.rows.length === 0){
            return sendError(res,ErrorType.unauthorized);
        }
        // console.log(new Date(result.rows[0].expires_at).getTime() > new Date().getTime())
        if(new Date(result.rows[0].expires_at).getTime() < new Date().getTime()){
            await deleteToken(req)
            return sendError(res,ErrorType.unauthorized);
        }
        req.user = user;
        next()
    }catch(err){
        next(err)
        throw err
    }
}