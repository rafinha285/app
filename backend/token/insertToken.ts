import * as e from "express";
import { JwtUser } from "../types";
export default async function insertToken(req:e.Request,user:JwtUser){
    try{
        req.db.query(`INSERT`)
        //use o crypto para mandar de volta o token
    }catch(err){

    }
}