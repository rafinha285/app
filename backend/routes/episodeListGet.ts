import { ErrorType, sendError } from "../assets/handle";
import {Router} from "express";
import {checkToken} from "../token/checkToken";
import {JwtUser} from "../types";


const episodeListGetRouter = Router();

episodeListGetRouter.get("/:id/:epId",checkToken, async (req, res) => {
    try {
        const {id,epId} = req.params;
        const {_id} = (req.user as JwtUser);
        const result = await req.db.query(`
            SELECT * FROM users.user_episode_list
            WHERE
                anime_id = $1 AND 
                episode_id = $2 AND 
                user_id = $3;
        `,[id,epId,_id])
        res.json({success: true, message: result.rows[0]})
    }catch(err:any) {
        sendError(res, 500, err);
    }
})

export default episodeListGetRouter;
