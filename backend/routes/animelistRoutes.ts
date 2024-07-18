import * as express from "express";
import { animeClient } from "../database/Postgre";
import { checkToken } from "../assets/handle";
export const animeListRouter = express.Router();

animeListRouter.get('/animelist',checkToken, async (req:express.Request, res:express.Response) => {
    try{
        var response = await animeClient.query(`
            SELECT 
                episode_id,
                dropped_on,
                season_id, 
                anime_id, 
                date,
                duration,
                ep_index,
                name, 
                season_name
            FROM user_anime_list WHERE user_id = $1;
        `,[req.user])
        
        res.send(response.rows)
    }catch(err){

    }
});
animeListRouter.get('/season/eps/:seaId',checkToken,async(req:express.Request,res:express.Response)=>{
    try{
        
    }catch(err){

    }
})
