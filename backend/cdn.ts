import * as e from 'express'
import * as path from 'path'
import * as fs from 'fs'
import { ErrorType, sendError, sendFile, setHeader , Console} from './assets/handle'
import { ANIME_PATH } from './consts'
// import { Console } from 'console'

// @ts-ignore
const app = e()

app.get('/ani/img',async(req:e.Request,res:e.Response)=>{
    setHeader(res)
    try{
        if(req.query.Id == null || req.query.Id == undefined){
            throw 1
        }
        sendFile().img(res)
        const typesImg = ["jpe","jpg","jpeg","png"]
        let im = typesImg.length
        for(let i = 0;i<im;i++){
            let pathImg = path.join(ANIME_PATH,(req.query.Id as string),"img",`${req.query.Id}.${typesImg[i]}`)
            if(fs.existsSync(pathImg)){
                return res.sendFile(pathImg)
            }
        }
    }catch(err){
        if(err == 1){
            sendError(res,ErrorType.undefined)
        }else if(err == 2){
            sendError(res,ErrorType.NotId)
        }
    }
})
app.get("/ep/:aniId/:season/:epId/:file",async(req:e.Request,res:e.Response)=>{
    setHeader(res)
    var {aniId,season,epId,file} = req.params
    res.set('Cache-Control', 'public, max-age=7200')
    res.sendFile(path.join(ANIME_PATH,aniId,"seasons",season,epId,file))
})
// app.get('/favicon.ico',async(req:e.Request,res:e.Response)=>{
//     res.sendFile("../build/favicon.ico")
// })
app.listen(8080,'0.0.0.0',()=>{
    Console.log(`http://0.0.0.0:8080`)
})
