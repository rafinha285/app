import {Router} from "express";
import {checkToken} from "../token/checkToken";
import {Console, ErrorType, sendError} from "../assets/handle";
import {JwtUser} from "../types";

const episodeListPostRouter = Router();

episodeListPostRouter.post('/',checkToken,async (req,res)=>{
    try{
        // Console.log(req.body)
        const {anime_id,dropped_on,episode_id,season_id} = req.body;
        await req.db.query(`
            SELECT check_and_insert_user_anime_list($1, $2);
        `, [
            (req.user as JwtUser)._id,  // user_id
            anime_id                    // anime_id
        ]);
        await req.db.query(`
            INSERT INTO users.user_episode_list
            (
                episode_id,
                dropped_on,
                season_id,
                anime_id,
                user_id,
                watched
            )
            VALUES
                (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5,
                    ($2 >= (SELECT ending::double precision FROM anime.episodes WHERE id = $1))
                )
            ON CONFLICT (user_id, episode_id)
                DO UPDATE
                SET dropped_on = $2,
                    date = now(),
                    watched = ($2 >= (SELECT ending::double precision FROM anime.episodes WHERE id = $1));
        `,[
            episode_id,
            dropped_on,
            season_id,
            anime_id,
            (req.user as JwtUser)._id,
        ])
        res.json({success:true})
    }catch(err){
        sendError(res,ErrorType.default,500,err)
    }
})

export default episodeListPostRouter;