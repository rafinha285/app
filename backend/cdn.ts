import * as e from 'express'
import * as path from 'path'
import * as fs from 'fs'
// import * as cors from 'cors';
// @ts-ignore
import { ErrorType, sendError, sendFile, setHeader , Console} from './assets/handle'
import { ANIME_PATH } from './consts'
// import { Console } from 'console'

// @ts-ignore
const app = e()

// app.use(cors({credentials:true}));


app.get('/ani/img',async(req:e.Request,res:e.Response)=>{
    setHeader(res)
    try{
        if(req.query.Id == null){
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
    // Console.log(req.ip)
    var {aniId,season,epId,file} = req.params
    if(file.split(".")[1] == "mp4"){
        res.status(206)
    }
    res.set('Cache-Control', 'public, max-age=7200')
    res.sendFile(path.join(ANIME_PATH,aniId,"seasons",season,epId,file))
})
app.get("/epPoster/:aniId/:season/:epId",async(req:e.Request,res:e.Response)=>{
    var {aniId,season,epId} = req.params
    res.set('Cache-Control', 'public, max-age=7200');
    res.sendFile(path.join(ANIME_PATH,aniId,"seasons",season,epId,`${epId}.jpg`))
})
app.get("/stream/:aniId/:season/:epId/:reso",async(req:e.Request,res:e.Response)=>{
    try{
        var {aniId,season,epId,reso} = req.params
        // Console.log(epId,reso,typeof reso)
        var filePath = path.join(ANIME_PATH,aniId,"seasons",season,epId,`${epId}-${reso}.mp4`)
        // Console.log(filePath)
        // const stat = fs.statSync(filePath);
        // const fileSize = stat.size;
        //
        // const readStream = fs.createReadStream(filePath);
        //
        // res.setHeader('Content-Type', 'video/mp4');
        // res.setHeader('Content-Length', fileSize);
        // res.setHeader('Content-Disposition', `attachment; filename=${epId}.mp4`);
        //
        // let uploadedBytes = 0;
        // readStream.on('data', (chunk) => {
        //     uploadedBytes += chunk.length;
        //     const progress = (uploadedBytes / fileSize) * 100;
        //     // Envia o progresso para o cliente
        //     res.status(206)
        //     res.write(chunk);
        // });
        //
        // readStream.on('end', () => {
        //     res.end();
        // });
        //
        // readStream.on('error', (err) => {
        //     console.error(err);
        //     res.status(500).end();
        // });
        res.sendFile(filePath)
        // res.download(path.join(ANIME_PATH,aniId,"seasons",seasonId,epId,`${epId}-${reso}.mp4`))
    }catch(err){
        sendError(res,ErrorType.default,500,err)
    }
})
app.get("/",(req:Request,res:e.Response)=>{
    res.redirect("https://animefoda.top")
})
app.listen(8082,'0.0.0.0',()=>{
    Console.log(`http://0.0.0.0:8080`)
})
