import * as jwt from "jsonwebtoken"
import e from 'express';
import { Pool, PoolClient } from "pg";

declare global{
    namespace Express {
        interface Request{
            db:Pool
            user?:JwtUser | jwt.JwtPayload |string
        }
    }
}
interface JwtUser {
    _id: string;
    username: string;
    user_agent:string;
    expires_at:Date;
    time_zone:string;
    web_gl_vendor:string;
    web_gl_renderer:string;
    // ip:string;
    // SecChUa:string
}
interface TokenRequest extends e.Request{
    user?:JwtUser | jwt.JwtPayload |string
}
