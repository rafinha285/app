import * as express from "express";
import { pgClient } from "../database/Postgre";
import { Console, ErrorType, sendError } from "../assets/handle";
import { checkToken } from "../token/checkToken";
import { JwtUser } from "../types";
import { EventEmitter } from 'events';
const animeListRouter = express.Router();


animeListRouter.post("/rating/:id",checkToken,async(req,res)=>{
    try{
        const {id} = req.params;
        const {rating} = req.body;
        // console.log(req.body,[parseInt(rating),(req.user as JwtUser)._id,id])
        await req.db.query(`UPDATE users.user_anime_list
            SET rate = $1
            WHERE user_id = $2 AND anime_id = $3
        `,[parseInt(rating),(req.user as JwtUser)._id,id])
        // console.log(result)
        res.json({success:true,message:rating})
    }catch(err){
        sendError(res,ErrorType.default,500,err)
    }
})
// animeListRouter.get('/season/eps/:aniId/:seaId',checkToken,async(req:express.Request,res:express.Response)=>{
//     try{
//         const {aniid,seaId} = req.params;
//         await pgClient.query(`
//             SELECT * FROM users.user_episode_list
//             WHERE user_id =
//             `)
//         }catch(err){

//         }
//     })

class AnimelistEmitterClass extends EventEmitter{
    on(event: 'updateNumbers', listener: (userId:string,err: Error | null) => void): this {
        // Chamando o método 'on' da classe EventEmitter
        super.on(event, listener);
        return this;
    }

    // Emitindo o evento 'updateNumbers' com argumento
    emitUpdateNumbers(userId:string,err: Error | null) {
        this.emit('updateNumbers', err);
    }
}

//!Rota para deletar anime da lista
//não era pra ta aq ma n tenho outro lugar pra bota

export const AnimelistEmitter = new AnimelistEmitterClass()
animeListRouter.delete("/delete/:id",checkToken,async(req,res)=>{
    try{
        await req.db.query(`
            DELETE FROM users.user_anime_list WHERE user_id = $1 AND anime_id = $2;
        `,[(req.user as JwtUser)._id,req.params.id])
        AnimelistEmitter.emitUpdateNumbers((req.user as JwtUser)._id,null)
        res.json({success:true,message:`Anime deletado da lista do ${(req.user as JwtUser).username}`});
    }catch(err){
        sendError(res,ErrorType.default,500,err)
    }
})
animeListRouter.patch("/update",checkToken,async(req,res)=>{
    try{
        const {id,watched_episodes,start_date,finish_date,state,priority,times_watched,rewatched_episodes} = req.body

        Console.log([
            watched_episodes,
            start_date,
            finish_date,
            state,
            priority,
            times_watched,
            rewatched_episodes,
            id,
        ])
        await pgClient.query(`
            UPDATE users.user_anime_list
                SET 
                watched_episodes = $1,
                start_date = $2,
                finish_date = $3,
                status = $4,
                priority = $5,
                times_watched = $6,
                rewatched_episodes = $7
            WHERE id = $8
        `,[
            watched_episodes,
            start_date,
            finish_date,
            state,
            priority,
            times_watched,
            rewatched_episodes,
            id,
        ]).then(r=>Console.log(r))
        // AnimelistEmitter.emitUpdateNumbers((req.user as JwtUser)._id,null)
        res.json({success:true,message:"Atualizado com sucesso"})
    }catch(err){
        sendError(res,ErrorType.default,500,err)
    }
})
animeListRouter.get('/checklist/:id',checkToken,async(req,res)=>{
    try{
        const user = req.user as JwtUser;
        let result = await req.db.query(`SELECT COUNT(*)
            FROM users.user_anime_list
            WHERE user_id = $1
            AND anime_id = $2`,
        [user._id,req.params.id]);
        // Console.log(result)
        res.json({success:parseInt(result.rows[0].count) !== 0})
    }catch(err){
        sendError(res,ErrorType.default,500,err)
    }
})
animeListRouter.post('/insert/:id',checkToken,async(req,res)=>{
    try{
        const user = req.user as JwtUser;
        const ani = (await req.db.query("SELECT * FROM anime.anime WHERE id = $1",[req.params.id])).rows[0];
        await pgClient.query(`
            INSERT INTO users.user_anime_list(
                user_id, anime_id, status, name, start_date, priority)
                VALUES ($1, $2, $3, $4, $5, $6);
        `,[user._id,req.params.id,'watching',ani.name,new Date(),"LOW"]);
        // console.log('updateNumbers',user)
        AnimelistEmitter.emitUpdateNumbers((req.user as JwtUser)._id,null)
        res.json({success:true,message:`Anime adicionado a lista ${user._id}`})
    }catch(err){
        sendError(res,ErrorType.default,500,err);
    }
})
animeListRouter.get("/:id",checkToken,async(req,res)=>{
    try{
        const {id} = req.params;
        res.json({success:true,response:(await req.db.query(`SELECT * FROM users.user_anime_list WHERE user_id = $1 AND anime_id = $2`,[(req.user as JwtUser)._id,id])).rows[0]})
    }catch(err){
        sendError(res,ErrorType.default,500,err);
    }
})
animeListRouter.get('/',checkToken, async (req:express.Request, res:express.Response) => {
    try{
        var response = await pgClient.query(`
            SELECT user_id, anime_id, status, name, start_date, finish_date, rate, times_watched, priority, rewatched_episodes, last_ep, id, watched_episodes
            FROM users.user_anime_list WHERE user_id = $1;
            `,[(req.user as JwtUser)._id])

            res.send(response.rows)
        }catch(err){
            sendError(res,ErrorType.default,500,err)
        }
    });
export default animeListRouter;
