import * as express from "express";
import { pgClient } from "../database/Postgre";
import { checkToken, ErrorType, sendError } from "../assets/handle";
const animeListRouter = express.Router();

animeListRouter.get('/animelist',checkToken, async (req:express.Request, res:express.Response) => {
    try{
        var response = await pgClient.query(`
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
animeListRouter.get('/season/eps/:aniId/:seaId',checkToken,async(req:express.Request,res:express.Response)=>{
    try{
        const {aniid,seaId} = req.params;
        await pgClient.query(`
            SELECT * FROM users.user_episode_list
                WHERE user_id = 
        `)
    }catch(err){

    }
})
animeListRouter.patch("/update",checkToken,async(req,res)=>{
    try{
        const {id,watched_episodes,start_date,finish_date,rate,state,priority,times_watched,rewatched_episodes} = req.body

        await pgClient.query(`
        UPDATE users.user_anime_list
            SET 
                watched_episodes =$1
                start_date = $2,
                finish_date = $3,
                rate = $4,
                state = $5,
                priority = $6,
                times_watched = $7,
                rewatched_episodes = $8
        WHERE id = $9
    `,[
            watched_episodes,
            start_date,
            finish_date,
            rate,
            state,
            priority,
            times_watched,
            rewatched_episodes,
            id
        ])
        res.json({success:true,message:"Atualizado com sucesso"})
    }catch(err){
        sendError(res,ErrorType.default,500,err)
    }
})

export default animeListRouter;