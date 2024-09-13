import * as e from "express";
import { JwtUser } from "../types";
import * as jwt from 'jsonwebtoken'
import { secretKey } from "../secret/config";
import { pgClient } from "../database/Postgre";
import { ErrorType } from "../assets/handle";
export default async function deleteToken(req:e.Request) {
    try{
        const tokenHeader = req.headers.authorization?.split(" ")[1];
        const tokencookie = req.cookies.token
        const token = tokenHeader || tokencookie;
        if(!token){
            throw ErrorType.noToken
        }
        let jwtResult = jwt.verify(token,secretKey);
        const user = jwtResult as JwtUser;
        await pgClient.query(`
            DELETE FROM users.users_sessions
                WHERE user_id = $1 AND user_agent = $2;
        `,[user._id,user.user_agent]);
        return true;
    }catch(err){
        throw err
    }
}