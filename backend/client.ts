import * as e from 'express'
// import * as ip from 'ip'
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
import {sendError, sendFile,Console,cut,setHeader, ErrorType, addUser,addLog, openConnectionAnime, endConnectionAnime} from "./assets/handle"
// import { AnimeDocument, producers } from '../src/types/animeModel'
import { Log } from '../src/types/logType'
// import { animeClient } from './assets/Postgre'
import { Query, QueryConfig, QueryResult } from 'pg'
import { client } from './assets/pool'
import { ANIME_PATH } from './consts'
import { types } from 'cassandra-driver'
import { EpisodeSim } from '../src/types/episodeModel'
import {tupleToSeason} from "../src/functions/animeFunctions"

const privateKey = fs.readFileSync(path.join(__dirname,"../","../","https","chave.pem"), 'utf8');
const certificate = fs.readFileSync(path.join(__dirname,"../","../","https",'certificado.pem'), 'utf8');
const credentials = { key: privateKey, cert: certificate };
var app = e()
// const ip_1 = ip.address("Radmin VPN")
// const ip_2 = ip.address("Ethernet")
// const mongoUri = `mongodb://${ip_1}:211/data`
// const couch:nano.ServerScope = Nano('http://admin:285@127.0.0.1:5984');
var animePath = path.join("D:","main","server","Anime")
var mangaPath = path.join("D:","main","server","Manga")


// const corsOptions = {
//     origin: (origin, callback) => {
//       // Verifica se a origem da solicitação corresponde à origem esperada
//       if (origin === undefined || origin === `https://${ip_1}`|| origin === `https://${ip_2}`) {
//         callback(null, true); // Permite a solicitação
//       } else {
//         callback(new Error('Acesso bloqueado por política de CORS')); // Bloqueia a solicitação
//       }
//     },
//   };
// app.use(cors(corsOptions))
app.use(json());
app.use(urlencoded({ extended: true }));

// app.use(helmet({
//     contentSecurityPolicy:{
//         directives:{
//             defaultSrc: ['self', "*.ngrok-free.app"],
//             scriptSrc:['self','https://kit.fontawesome.com','https://ajax.googleapis.com','https://ka-f.fontawesome.com',"https://cdn.plyr.io",'unsafe-inline', "*.ngrok-free.app"],
//             scriptSrcElem: ['self', 'https://ajax.googleapis.com', 'https://kit.fontawesome.com',"*.ngrok-free.app"],
//             connectSrc: ['self', 'https://kit.fontawesome.com', 'https://ajax.googleapis.com', 'https://ka-f.fontawesome.com',"https://cdn.plyr.io",'unsafe-inline',"*.ngrok-free.app"],
//             mediaSrc:['self',"*.ngrok-free.app","https://cdn.plyr.io"]
//         }
//     },
// }))



// mongoose.connect(mongoUri,{ connectTimeoutMS: 30000, bufferCommands: false, serverSelectionTimeoutMS: 300000 })
// var db = mongoose.connection
// const aniCol:mongoose.Collection = db.collection("anime")

const router = e.Router()
router.use((req,res,next)=>{
  client.connect()
        .then(()=>{
            req.db = client;
            next()
        })
        .catch(err=>{
            Console.error(err);
            sendError(res,ErrorType.default,500,"Erro na database");
        })
})


router.get('/ani/lan',async(req,res)=>{
  try{
    setHeader(res)
    res.setHeader("Cache-Control","public, max-age:60")
    //WHERE date_added BETWEEN CURRENT_TIMESTAMP - INTERVAL '7 days' AND CURRENT_TIMESTAMP;
    var query = `SELECT id, name, description, genre, averageeptime FROM anime;`
    
    await req.db.execute(query).then((v)=>{
      Console.log(v.rows)
      res.send(v.rows)
    }).catch((err)=>{
      throw new Error(err)
    })
    
  }catch(err){
    Console.error(err)
    sendError(res,ErrorType.undefined)
  }
})
router.get('/ani/img',async(req:e.Request,res:e.Response)=>{
  setHeader(res)
  try{
    
    if(req.query.Id == null || req.query.Id == undefined){
      throw 1
    }
    sendFile().img(res)
    res.sendFile(path.join(animePath,(req.query.Id as string),"img",`${req.query.Id}.jpg`))
  }catch(err){
    if(err == 1){
      sendError(res,ErrorType.undefined)
    }else if(err == 2){
      sendError(res,ErrorType.NotId)
    }
  }
})
// router.get("/ani/:id/ass",async(req:e.Request,res:e.Response)=>{
//   var client= await openConnectionAnime()
//   try{
//     if(!req.params.id){
//       throw ErrorType.undefined
//     }
//     var query:QueryConfig={
//       text:`
//       SELECT producer_id
//         FROM animes.anime_producers
//         WHERE anime_id = $1;
//       `,
//       values:[req.params.id]
//     }
//     var resultProd:QueryResult = await animeClient.query(query)
//     query={
//       text:`
//       SELECT creator_id
//       FROM animes.anime_creators
//       WHERE anime_id = $1;
//       `,
//       values:[req.params.id]
//     }
//     var resultCrea:QueryResult = await animeClient.query(query)
//     query={
//       text:`
//       SELECT studio_id
//       FROM animes.anime_studios
//       WHERE anime_id = $1;
//       `,
//       values:[req.params.id]
//     }
//     var resultStu:QueryResult = await animeClient.query(query)

    
//     var ress = {
//       producers:resultProd.rows,
//       creators:resultCrea.rows,
//       studios:resultStu.rows
//     }
//     res.json(ress)
    
//   }catch(err:any|ErrorType){
//     switch(err){
//       case ErrorType.undefined:
//         sendError(res,ErrorType.undefined)
//         break
//       case ErrorType.default:
//         sendError(res,ErrorType.default,500,err)
//         break
//     }
//   }finally{
//     await endConnectionAnime(client)
//   }
// })
router.get("/g/eps/:animeId/:seasonId/:ep",async (req,res)=>{
  try{
    if(!req.params.animeId || !req.params.seasonId||!req.params.ep){
      throw ErrorType.undefined
    }

    var ep = await req.db.execute("SELECT * FROM episodes WHERE animeid = ? AND seasonid = ? AND id = ? ALLOW FILTERING;",[req.params.animeId,req.params.seasonId,req.params.ep],{prepare:true})
    res.send(ep.rows[0])
  }catch(err){
    switch(err){
      case ErrorType.undefined:
        sendError(res,ErrorType.undefined,400,"")
        break
      default:
        sendError(res,ErrorType.default,500,err)
    }
    
  }
})
router.get("/ani/:id",async(req:e.Request,res:e.Response)=>{
  try{
    // var doc = await couch.use("anime").get(req.params.id)
    var query =`SELECT * FROM anime WHERE id = ${req.params.id};`
    await req.db.execute(query).then((v)=>{
      setHeader(res)
      Console.log(v.rows[0])
      res.send(v.rows[0])
    }).catch((err)=>{
      Console.log(err)
      throw new Error(err)
    })
    
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
  try{
    var docs = await req.db.execute(`SELECT id, name, description,rating FROM anime WHERE genre CONTAINS ?`,[req.params.gen],{prepare:true})
    res.send(docs.rows)
  }catch(err){
    sendError(res,ErrorType.default,500,err)
  }
 
})
router.get('/search',async (req:e.Request,res:e.Response)=>{
  try{
    var search= req.query.s
    var result = await req.db.execute(`SELECT id, name, description,rating FROM anime WHERE name LIKE ? ALLOW FILTERING`,[`%${search}%`],{prepare:true})
    res.send(result.rows)
    // var db = couch.use("anime")
    // Console.log(await db.get("_design/search"))
    // db.view("anime","search",{include_docs:true,key:{search}},(err,response)=>{
    //   if(err)throw err
    //   Console.log(response)
    //   const result = response.rows.map(row => row.doc); // Obtém os documentos da view

    //   console.log(result);
    //   res.send(result)
    // })
    // Console.log(animeResults)
    
  }catch(err){
    sendError(res,ErrorType.default,500,err)
  }

})
// router.get("/g/ep/:aniId/:sId/:id",async(req,res)=>{
//   try{
//     var doc = await couch.use("anime").get(req.params.aniId) as AnimeDocument
//     var s = doc.seasons!.find((v)=>v._id === req.params.sId)
//     var ep = s!.episodes.find((v)=>v._id===req.params.id)
//     Console.log(doc,s,ep)
//     Console.log(doc.seasons)
//     res.send(ep)
//   }catch(err){
//     sendError(res,ErrorType.default,500,err)
//   }
// })
router.get("/g/s/eps/:animeid/:seasonid",async(req,res)=>{
  try{
    const {animeid,seasonid} = req.params
    var result = await req.db.execute("SELECT * FROM episodes WHERE animeid = ? AND seasonid = ? ALLOW FILTERING",[types.Uuid.fromString(animeid),types.Uuid.fromString(seasonid)])
    Console.log(result.rows)
    res.send(result.rows)
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
    var eps:EpisodeSim[] = []
    var semana = Math.floor(Date.now()/1000) - 1209600
    var result = await req.db.execute("SELECT id, animeid, seasonid, name, duration, resolution FROM episodes WHERE date_added >= ? ALLOW FILTERING",[semana],{prepare:true})
    result.rows.forEach(async ee=>{
      var {id,animeid,seasonid,name,duration,resolution} = ee
      var aniS = await req.db.execute("SELECT name FROM anime WHERE id = ?",[animeid],{prepare:true})
      // var season = tupleToSeason(aniS.rows[0].seasons).find(e=>e.id === seasonid)
      // console.log(season)
      
      var ep:EpisodeSim={
        id,
        animeid,
        seasonid,
        name,
        duration,
        resolution,
        animename:aniS.rows[0].name,
        // seasonname:season?.name!
      }
      console.log(ep)
      eps.push(ep)
    })
    setTimeout(()=>{
      Console.log(eps)
      res.send(eps)
    },2)
    
   
    
    // var {count} = req.query
    // if(count){
    //   logPool.query('SELECT * FROM public."newEpisodes" WHERE date >= CURRENT_DATE - INTERVAL \'7 days\' ORDER BY date DESC LIMIT $1',[count])
    //   .then((result)=>{
    //     res.send(result.rows)
    //   })
    //   .catch((err)=>{
    //     throw err
    //   })
    // }else{
    //   logPool.query('SELECT * FROM public."newEpisodes" WHERE date >= CURRENT_DATE - INTERVAL \'7 days\' ORDER BY date DESC')
    //   .then((result)=>{
    //     res.send(result.rows)
    //   })
    //   .catch((err)=>{
    //     throw err
    //   })
    // }
    
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
  var {aniId,season,epId,file} = req.params
  res.set('Cache-Control', 'public, max-age=7200')
  res.sendFile(path.join(ANIME_PATH,aniId,"seasons",season,epId,file))
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

// app.listen(80,"0.0.0.0",()=>{
//   console.log("Aberto em 0.0.0.0")
// })

httpsServer.listen(443,"0.0.0.0",()=>{
    Console.log(`https://0.0.0.0`)
})
// httpsServer.listen(443,ip_2,()=>{
//   Console.log(`https://${ip_2}`)
// })
// app.listen(80,ip_2,()=>{
//   Console.log(`http://${ip_2}`)
// })