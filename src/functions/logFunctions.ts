import $ from "jquery"
import {v4 as uuid} from "uuid"
import { Log } from "../types/logType"
import { AnimeDocument } from "../types/animeModel"
import { page } from "../types/logType"
import { EpisodeDocument } from "../types/episodeModel"

function postLog(ani:AnimeDocument,episode:boolean,epid:string|null = null,plyrDuration:number|null = null){
    console.log(ani,episode,epid,plyrDuration)
    if(episode){
        var data:Log = {
            // _id:uuid(),
            date:new Date(Date.now()),
            anime:ani?._id,
            page:page.WATCH,
            duration:plyrDuration!,
            ep:epid!
        }
        data.page = page[data.page]
        $.ajax({
            method:"POST",
            url:"/api/log",
            data:data
        })
    }else{
        var data:Log = {
            // _id:uuid(),
            date:new Date(Date.now()),
            anime:ani?._id,
            page:page.ANIMEPAGE,
        }
        data.page = page[data.page]
        $.ajax({
            method:"POST",
            url:"/api/log",
            data:data
        })
    }
    
}
export default postLog