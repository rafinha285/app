import { Client } from "cassandra-driver";
import * as jwt from "jsonwebtoken"
import e from 'express';

declare global{
    namespace Express {
        interface Request{
            db:Client
            user?:JwtUser | jwt.JwtPayload |string
        }
    }
}
interface JwtUser {
    _id: string;
    username: string;
    UserAgent:string;
    ip:string;
    // SecChUa:string
}
interface TokenRequest extends e.Request{
    user?:JwtUser | jwt.JwtPayload |string
}
