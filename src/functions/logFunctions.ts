import {v4 as uuid} from "uuid"
import { Log } from "../types/logType"
import { Anime } from "../types/animeModel"
import { page } from "../types/logType"
import { Episode } from "../types/episodeModel"

// function postLog(ani:Anime,episode:boolean,epid:string|null = null,plyrDuration:number|null = null){
//     console.log(ani,episode,epid,plyrDuration)
//     let data:Log
//     if(episode){
//         data = {
//             // _id:uuid(),
//             date:new Date(Date.now()),
//             anime:ani?.id,
//             page:page.WATCH,
//             duration:plyrDuration!,
//             ep:epid!
//         }
//         data.page = page[data.page]
//         $.ajax({
//             method:"POST",
//             url:"/api/log",
//             data:data
//         })
//     }else{
//         data = {
//             // _id:uuid(),
//             date:new Date(Date.now()),
//             anime:ani?.id,
//             page:page.ANIMEPAGE,
//         }
//         data.page = page[data.page]
//         fet({
//             method:"POST",
//             url:"/api/log",
//             data:data
//         })
//     }
//
// }
// export default postLog
