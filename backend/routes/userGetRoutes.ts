import * as e from "express";
import { checkToken, ErrorType, sendError } from "../assets/handle";
import { pgClient } from "../database/Postgre";
import { JwtUser } from "../types";

const userGetRouter = e.Router()

userGetRouter.get("/verify",checkToken,(req,res)=>{
    res.json({success:true})
})
userGetRouter.get("/user",checkToken,async(req,res)=>{
    try{
        let result = await pgClient.query(`
        SELECT _id, name, surname, username, birthdate, email, totalanime, totalanimewatching, totalanimecompleted, totalanimedropped, totalanimeplantowatch, role, totalmanga, totalmangareading, totalmangacompleted, totalmangadropped, totalmangaplantoread, totalanimeliked, totalmangaliked,totalanimeonhold,totalmangaonhold
        FROM users.users
        WHERE _id = $1;
    `,[(req.user as JwtUser)._id])
        if(result.rows.length < 1){
            throw ErrorType.invalidPassOrEmail
        }
        res.send(result.rows[0])
    }catch(err){
        switch(err){
            case ErrorType.noToken:
                sendError(res,ErrorType.noToken)
                break
            default:
                sendError(res,ErrorType.default,500,err)
                break
        }
    }
})

export default userGetRouter