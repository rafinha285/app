import * as e from 'express'
import * as ip from 'ip'
import * as path from 'path'
import * as cors from 'cors'
import * as fs from 'fs'
import * as https from "https"
import helmet from "helmet"
import bodyParser,{urlencoded,json} from "body-parser"
// import {pool} from './assets/Postgre'
import {User} from "../src/types/userType"
// import mongoose from "mongoose"
import * as nano from "nano"
const Nano = require('nano');
import { Anime } from '../../app_admin/src/types/animeModel'
import {sendError, sendFile,Console,cut,setHeader, ErrorType, addUser,addLog} from "./assets/handle"
import { AnimeDocument } from '../src/types/animeModel'
import { Log } from '../src/types/logType'
import { logPool } from './assets/Postgre'

const privateKey = fs.readFileSync('D:\\main\\https\\chave.pem', 'utf8');
const certificate = fs.readFileSync('D:\\main\\https\\certificado.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };
var app = e()
const ip_1 = ip.address("Radmin VPN")
const ip_2 = ip.address("Ethernet")
// const mongoUri = `mongodb://${ip_1}:211/data`
const couch:nano.ServerScope = Nano('http://admin:285@127.0.0.1:5984');


const corsOptions = {
    origin: (origin, callback) => {
      // Verifica se a origem da solicitação corresponde à origem esperada
      if (origin === undefined || origin === `https://${ip_1}`|| origin === `https://${ip_2}`) {
        callback(null, true); // Permite a solicitação
      } else {
        callback(new Error('Acesso bloqueado por política de CORS')); // Bloqueia a solicitação
      }
    },
  };
app.use(cors(corsOptions))
app.use(json());
app.use(urlencoded({ extended: true }));

app.use(helmet({
    contentSecurityPolicy:{
        directives:{
            defaultSrc: ['self', "*.ngrok-free.app"],
            scriptSrc:['self','https://kit.fontawesome.com','https://ajax.googleapis.com','https://ka-f.fontawesome.com',"https://cdn.plyr.io",'unsafe-inline', "*.ngrok-free.app"],
            scriptSrcElem: ['self', 'https://ajax.googleapis.com', 'https://kit.fontawesome.com',"*.ngrok-free.app"],
            connectSrc: ['self', 'https://kit.fontawesome.com', 'https://ajax.googleapis.com', 'https://ka-f.fontawesome.com',"https://cdn.plyr.io",'unsafe-inline',"*.ngrok-free.app"]
        }
    },
}))



// mongoose.connect(mongoUri,{ connectTimeoutMS: 30000, bufferCommands: false, serverSelectionTimeoutMS: 300000 })
// var db = mongoose.connection
// const aniCol:mongoose.Collection = db.collection("anime")

const router = e.Router()
router.get('/ani/lan',async(req,res)=>{
  setHeader(res)
  var docs = await couch.use("anime").list({include_docs:true}) as nano.DocumentListResponse<Anime>
  const uuidv4Docs = docs.rows.filter(doc => /^[\da-f]{8}-([\da-f]{4}-){3}[\da-f]{12}$/i.test(doc.doc!._id)).map(doc => doc.doc);
  res.setHeader("Cache-Control","public, max-age:60")
  res.send(uuidv4Docs.reverse().slice(0,10));
})
router.get('/ani/img',async(req:e.Request,res:e.Response)=>{
  setHeader(res)
  try{
    
    if(req.query.Id == null || req.query.Id == undefined){
      throw 1
    }
    var doc = await couch.use("anime").get(req.query.Id.toString()) as AnimeDocument
    
    sendFile().img(res)
    res.sendFile(path.join(doc?.path!,"img",`${doc?._id}.jpg`))
  }catch(err){
    if(err == 1){
      sendError(res,ErrorType.undefined)
    }else if(err == 2){
      sendError(res,ErrorType.NotId)
    }
  }
})
router.get("/ani/:id",async(req:e.Request,res:e.Response)=>{
  try{
    var doc = await couch.use("anime").get(req.params.id)
    // sleep.sleep(4)
    setHeader(res)
    res.send(doc)
  }catch(err:any){
    sendError(res,ErrorType.NotId)
  }
})
app.get("/ani/season/",(req,res)=>{
  try{
    // setHeader(res)
  var GetCurrentSeason = req.get("GetCurrentSeason");
  //console.log(GetCurrentSeason, typeof GetCurrentSeason);
  if (GetCurrentSeason == "false") {
      var m = parseInt(req.query.month as string)
      var y = req.query.year
      var data1 = {
          "month": m,
          "year": y,
          "season": (function () {
              switch (true) {
                  case m >= 0 && m <= 2:
                      return "Inverno";
                  case m >= 3 && m <= 5:
                      return "Primavera";
                  case m >= 6 && m <= 8:
                      return "Verão";
                  case m >= 9 && m <= 11:
                      return "Outono";
                  default:
                      return "undefined";
              }
          })()
      };
      res.send(data1);
  }
  else if (GetCurrentSeason == "true") {
      var d = new Date();
      var dM = d.getMonth();
      var dY = d.getFullYear();
      var data = {
          "month": dM,
          "year": dY,
          "season": (function () {
              switch (true) {
                  case dM >= 0 && dM <= 2:
                      return "winter";
                  case dM >= 3 && dM <= 5:
                      return "spring";
                  case dM >= 6 && dM <= 8:
                      return "summer";
                  case dM >= 9 && dM <= 11:
                      return "fall";
                  default:
                      return "undefined";
              }
          })()
      };
      res.send(data);
  }
  }catch(err){
    sendError(res,ErrorType.default,500,"Error while getting release season")
  }
})
router.get("/ani/gen/:gen",async(req:e.Request,res:e.Response)=>{
  const agg:nano.MangoQuery = {
    selector:{
      generos:req.params.gen
    }
  }
  var docs =await couch.use("anime").find(agg) as nano.MangoResponse<Anime[]>;
  res.send(docs)
})
router.get('/search',async (req:e.Request,res:e.Response)=>{
  try{
    var search= req.query.s
    var db = couch.use("anime")
    Console.log(await db.get("_design/search"))
    db.view("anime","search",{include_docs:true,key:{search}},(err,response)=>{
      if(err)throw err
      Console.log(response)
      const result = response.rows.map(row => row.doc); // Obtém os documentos da view

      console.log(result);
      res.send(result)
    })
    // Console.log(animeResults)
    
  }catch(err){
    sendError(res,ErrorType.default,500,err)
  }

})
router.get("/g/ep/:aniId/:sId/:id",async(req,res)=>{
  try{
    var doc = await couch.use("anime").get(req.params.aniId) as AnimeDocument
    var s = doc.seasons!.find((v)=>v._id === req.params.sId)
    var ep = s!.episodes.find((v)=>v._id===req.params.id)
    Console.log(doc,s,ep)
    Console.log(doc.seasons)
    res.send(ep)
  }catch(err){
    sendError(res,ErrorType.default,500,err)
  }
})
router.get("/g/eps",async(req,res)=>{
  // const query = {
  //   text: 'SELECT * FROM public."newEpisodes" WHERE date >= CURRENT_DATE - INTERVAL 7 days',
  //   values: ['7 days'],
  // };
  try{
    var {count} = req.query
    if(count){
      logPool.query('SELECT * FROM public."newEpisodes" WHERE date >= CURRENT_DATE - INTERVAL \'7 days\' ORDER BY date DESC LIMIT $1',[count])
      .then((result)=>{
        res.send(result.rows)
      })
      .catch((err)=>{
        throw err
      })
    }else{
      logPool.query('SELECT * FROM public."newEpisodes" WHERE date >= CURRENT_DATE - INTERVAL \'7 days\' ORDER BY date DESC')
      .then((result)=>{
        res.send(result.rows)
      })
      .catch((err)=>{
        throw err
      })
    }
    
  }catch(err){
    sendError(res,ErrorType.default,500,err)
  }
})
// router.get("/ani/char/:aniId/:charId",async(req,res)=>{
//   try{
//     var doc = await couch.use("anime").get(req.params.aniId) as AnimeDocument;
//     var char = doc.characters?.find((v)=>v._id == req.params.charId)
//     res.send(char)
//   }catch(err){
//     sendError(res,ErrorType.default,500,err)
//   }
// })
router.get("/ani/char/:aniId/:charId/img",async(req,res)=>{
  try{
    var doc = await couch.use("anime").get(req.params.aniId) as AnimeDocument;
    // var char = doc.characters?.find((v)=>v._id == req.params.charId);
    res.sendFile(path.join(doc.path!,"characters",req.params.charId,`${req.params.charId}.jpg`))
  }catch(err){
    sendError(res,ErrorType.default,500,err)
  }
})
router.get("/test",(req:e.Request,res:e.Response)=>{
  res.sendFile("E:\\main\\app\\src\\test\\test.html")
})
router.get("/css/:file",(req:e.Request,res:e.Response)=>{
  res.sendFile(path.join("E:\\main\\app\\src\\css",req.params.file))
})
router.get("/ep/:aniId/:season/:epId/:file",async(req,res)=>{
  setHeader(res)
  var ani = await couch.use("anime").get(req.params.aniId) as AnimeDocument
  var sea = ani.seasons?.find((v)=>v._id===req.params.season)
  var ep = sea?.episodes.find((v)=>v._id===req.params.epId)
  res.set('Cache-Control', 'public, max-age=7200')
  // Console.log(ani.path,sea?._id,req.params.epId,req.params.file)
  res.sendFile(path.join(ani.path!,"seasons",sea?._id!,ep?._id!,req.params.file))
})
router.post("/new/user",async(req:e.Request,res:e.Response)=>{
  var userData:User = req.body
  try{
    const user = await addUser(userData)
    res.json(user)
  }catch(err){
    sendError(res,ErrorType.default,500,err)
  }
})
router.post('/log',async(req:e.Request,res:e.Response)=>{
  var logData:Log = req.body
  try{
    var log = await addLog(logData)
    res.json(log)
  }catch(err){
    sendError(res,ErrorType.default,500,err)
  }
})
app.use('/api',router)

app.use(e.static(path.join("D:\\main\\app","build")))

app.get('*',(req:e.Request,res:e.Response)=>{
    sendFile().cssJs(res)
    res.sendFile(path.join("D:\\main\\app\\build","index.html"))
})


const httpsServer = https.createServer(credentials,app)



httpsServer.listen(443,"0.0.0.0",()=>{
    Console.log(`https://0.0.0.0`)
})
// httpsServer.listen(443,ip_2,()=>{
//   Console.log(`https://${ip_2}`)
// })
// app.listen(80,ip_2,()=>{
//   Console.log(`http://${ip_2}`)
// })