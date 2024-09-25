import * as e from 'express'
import * as path from 'path'
import * as fs from 'fs'
import {Console, ErrorType, sendError, sendFile, setHeader} from './assets/handle'
import {ANIME_PATH} from './consts'

// @ts-ignore
const app = e()

// app.use((req:e.Request, res:e.Response, next:e.NextFunction) => {
//     res.header('Access-Control-Allow-Origin', '*'); // Ou o domínio específico
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     next();
// });
//
// app.get('/i/',(req: e.Request, res: e.Response) => {
//     try {
//         //colocar uma imagem teste aq depois
//         //pra testa a velocidade da internet
//         res.sendFile(path.join(__dirname, `./public/index.html`))
//     }catch(err){
//         sendError(res,ErrorType.default,500,err)
//     }
// })
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
            // Console.log(path.join(ANIME_PATH,(req.query.Id as string),"img",`${req.query.Id}.${typesImg[i]}`))
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
app.get('/ep/:aniId/:seasonId/:epId/:lang',async(req:e.Request,res:e.Response)=>{
    setHeader(res)
    var {aniId,seasonId,epId,lang} = req.params
    res.set('Cache-Control', 'public, max-age=7200')
    res.sendFile(path.join(ANIME_PATH,aniId,'seasons',seasonId,epId,`${epId}-${lang}.vtt`))
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
        res.setHeader('Cache-Control', 'public, max-age=7200');
        res.sendFile(filePath)
        // res.download(path.join(ANIME_PATH,aniId,"seasons",seasonId,epId,`${epId}-${reso}.mp4`))
    }catch(err){
        sendError(res,ErrorType.default,500,err)
    }
})
//rota pro download do ep
app.get('/download/:aniid/:seasonid/:epid/:reso',async(req:e.Request,res:e.Response)=>{
    try{
        let { aniid, seasonid, epid, reso } = req.params;
        let filePath = path.join(ANIME_PATH, aniid, 'seasons', seasonid, epid, `${epid}-${reso}.mp4`);

        Console.log('File path:', filePath); // Adicione isso para verificar o caminho do arquivo

        const stat = fs.statSync(filePath);
        const fileSize = stat.size;

        const readStream = fs.createReadStream(filePath);

        res.setHeader('Content-Type', 'video/mp4');
        res.setHeader('Content-Length', fileSize);
        res.setHeader('Content-Disposition', `attachment; filename=${epid}.mp4`);

        let uploadedBytes = 0;
        readStream.on('data', (chunk) => {
            uploadedBytes += chunk.length;
            const canWrite = res.write(chunk);
            // console.log('Can write:', canWrite); // Adicione isso para verificar o status de escrita
            if (!canWrite) {
                readStream.pause();
            }
        });

        res.on('drain', () => {
            // console.log('Drain event'); // Adicione isso para verificar quando o buffer está vazio
            readStream.resume();
        });

        readStream.on('end', () => {
            Console.log('End of stream');
            res.end();
        });

        readStream.on('error', (err) => {
            console.error('Stream error:', err);
            res.status(500).end();
        });
        // res.sendFile(filePath)
    }catch(err){
        sendError(res,ErrorType.default,500,err)
    }
})
app.get("/",(req:e.Request,res:e.Response)=>{
    res.redirect("https://animefoda.top")
})
app.listen(8080,'0.0.0.0',()=>{
    Console.log(`http://0.0.0.0:8080`)
})
