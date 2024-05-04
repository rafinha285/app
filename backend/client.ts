import * as e from 'express'
// import * as ip from 'ip'
import * as path from 'path'
import * as cors from 'cors'
import * as fs from 'fs'
// import * as https from "https"
import * as http from 'http'
import helmet from "helmet"
import bodyParser,{urlencoded,json} from "body-parser"
// import {pool} from './assets/Postgre'
import {User} from "../src/types/userType"
// import mongoose from "mongoose"
// import * as nano from "nano"
// const Nano = require('nano');
// import { Anime } from '../../app_admin/src/types/animeModel'
import {sendError, sendFile,Console,cut,setHeader, ErrorType, addUser,addLog, openConnectionAnime, endConnectionAnime, checkToken} from "./assets/handle"
// import { AnimeDocument, producers } from '../src/types/animeModel'
import { Log } from '../src/types/logType'
// import { animeClient } from './assets/Postgre'
// import { Query, QueryConfig, QueryResult } from 'pg'
import { types as pgtypes } from 'pg'
import { client } from './database/pool'
import { ANIME_PATH, BUILD_HTML, BUILD_PATH, HTTPS_CERT_PATH, HTTPS_KEY_PATH } from './consts'
import { types } from 'cassandra-driver'
import { EpisodeSim } from '../src/types/episodeModel'
import {tupleToSeason} from "../src/functions/animeFunctions"
import * as sleep from 'sleep-promise';
// import WebSocket from 'ws';
import { animeClient } from './database/Postgre'
import * as cookieParser from "cookie-parser"
import * as jwt from "jsonwebtoken"
import { reCaptchaSecretKey, secretKey } from './secret/config'
import { JwtUser } from './types'
import { priorityValue, userAnimeState } from './assets/handle'
// import * as siteTypes from "../src/types/types"

// const privateKey = fs.readFileSync(HTTPS_KEY_PATH, 'utf8');
// const certificate = fs.readFileSync(HTTPS_CERT_PATH, 'utf8');
// const credentials = { key: privateKey, cert: certificate };
var app = e()
// const ip_1 = ip.address("Radmin VPN")
// const ip_2 = ip.address("Ethernet")
// const mongoUri = `mongodb://${ip_1}:211/data`
// const couch:nano.ServerScope = Nano('http://admin:285@127.0.0.1:5984');


// const corsOptions = {
//     origin: (origin, callback) => {
//       // Verificar se a origem é a mesma
//       if (origin && origin === 'https://animefoda.top') {
//         callback(null, true); // Permitir a origem
//       } else {
//         callback('Acesso não permitido'); // Recusar a origem
//       }
//     },
//   };
// app.use(cors(corsOptions))
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser())

const httpsServer = http.createServer(app)

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
    res.sendFile(path.join(ANIME_PATH,(req.query.Id as string),"img",`${req.query.Id}.jpg`))
  }catch(err){
    if(err == 1){
      sendError(res,ErrorType.undefined)
    }else if(err == 2){
      sendError(res,ErrorType.NotId)
    }
  }
})


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
router.get("/ani/agenda",async(req,res)=>{
  try{
    // console.log('agenda')
    var resp = await req.db.execute(`SELECT id, name, description,rating, weekday FROM anime WHERE state = 'Lançando' ALLOW FILTERING`)
    console.log(resp.rows)
    res.send(resp.rows)
  }catch(err){
    sendError(res,ErrorType.default,500,err)
  }
})
// get the props form anime (props = genre,studios,creators,producers) for the user page
router.get('/ani/:id/props',checkToken,async(req,res)=>{
  try{
    let response = await req.db.execute(`SELECT producers, creators, genre, studios FROM anime WHERE id = ?`,[req.params.id],{prepare:true})
    res.send(response.rows[0])
  }catch(err){
    sendError(res,ErrorType.default,500,err)
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


// router.get("/ani/prod/:prod",async(req,res)=>{
//   try{
//     const tuple = new types.Tuple(req.params.prod, '');
//     var prod = await req.db.execute("SELECT producers FRO anime WHERE producers CONTAINS ?",[tuple],{prepare:true})
//     Console.log(prod)
//     var docs = await req.db.execute(`SELECT id, name,description,rating FROM anime WHERE producers CONTAINS ?`,[tuple],{prepare:true})
//     res.send(docs.rows)
//   }catch(err){
//     sendError(res,ErrorType.default,500,err)
//   }
// })
// router.get("/ani/cria/:cria",async(req,res)=>{
//   try{
//     var docs = await req.db.execute(`SELECT id, name,description,rating FROM anime WHERE creators CONTAINS ?`,[req.params.cria],{prepare:true})
//     res.send(docs.rows)
//   }catch(err){
//     sendError(res,ErrorType.default,500,err)
//   }
// })
// router.get("/ani/stud/:stu",async(req,res)=>{
//   try{
//     var docs = await req.db.execute(`SELECT id, name,description,rating FROM anime WHERE studios CONTAINS ?`,[req.params.stu],{prepare:true})
//     res.send(docs.rows)
//   }catch(err){
//     sendError(res,ErrorType.default,500,err)
//   }
// })
router.get('/search',async (req:e.Request,res:e.Response)=>{
  try{
    var search= req.query.s
    Console.log(search)
    //[`'%${search}%'`,`'%${search}%'`]
    var result = await req.db.execute(`SELECT id, name, description,rating FROM anime WHERE name LIKE '%${search}%' OR name2 LIKE '%${search}%' ALLOW FILTERING`,[],{prepare:true})
    res.send(result.rows)
    
  }catch(err){
    sendError(res,ErrorType.default,500,err)
  }

})
router.get("/g/s/eps/:animeid/:seasonid",async(req,res)=>{
  try{
    const {animeid,seasonid} = req.params
    var result = await req.db.execute("SELECT * FROM episodes WHERE animeid = ? AND seasonid = ? ALLOW FILTERING",[types.Uuid.fromString(animeid),types.Uuid.fromString(seasonid)])
    await sleep(50)
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
    var {count} = req.query
    var eps:EpisodeSim[] = []
    let currentDate = new Date();

    // Subtrai uma semana (7 dias) da data atual
    let semana = new Date(currentDate.valueOf() - 7 * 24 * 60 * 60 * 1000);
    var result = await req.db.execute("SELECT id, animeid, seasonid, name, duration, resolution, date_added FROM episodes WHERE date_added >= ? LIMIT ? ALLOW FILTERING;",[semana,count],{prepare:true})
    Console.log(result)
    await sleep(2)
    result.rows.forEach(async ee=>{
      // Console.log(ee)
      var {id,animeid,seasonid,name,duration,resolution,date_added} = ee
      var aniS = await req.db.execute("SELECT name FROM anime WHERE id = ?",[animeid],{prepare:true})
      // Console.log(aniS)
      await sleep(20)
      
      var ep:EpisodeSim={
        id,
        animeid,
        seasonid,
        name,
        duration,
        resolution,
        animename:aniS.rows[0]?.name,
        // seasonname:season.name,
        date_added:new Date(date_added)
      }
      // console.log(ep)
      eps.push(ep)
      // Console.log(eps)
    })
    await sleep(20)
    eps.sort((a,b)=>new Date(b.date_added).valueOf() - new Date(a.date_added).valueOf())
    await sleep(20)
    res.send(eps)
    
    
  }catch(err){
    sendError(res,ErrorType.default,500,err)
  }
})
//!dabgpo
// router.get("/ani/char/:aniId/:charId/img",async(req,res)=>{
//   try{
//     var doc = await couch.use("anime").get(req.params.aniId) as AnimeDocument;
//     // var char = doc.characters?.find((v)=>v._id == req.params.charId);
//     res.sendFile(path.join(doc.path!,"characters",req.params.charId,`${req.params.charId}.jpg`))
//   }catch(err){
//     sendError(res,ErrorType.default,500,err)
//   }
// })


// const downloadwss = new WebSocket.Server({ server: httpsServer });
// downloadwss.on("connection",(ws)=>{
  
// })
router.get("/g/ep/download/:aniId/:seasonId/:epId/:reso",async(req,res)=>{
  try{
    var {aniId,seasonId,epId,reso} = req.params
    var filePath = path.join(ANIME_PATH,aniId,"seasons",seasonId,epId,`${epId}-${reso}.mp4`)

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;

    const readStream = fs.createReadStream(filePath);

    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Content-Length', fileSize);
    res.setHeader('Content-Disposition', `attachment; filename=${epId}.mp4`);

    let uploadedBytes = 0;
    readStream.on('data', (chunk) => {
      uploadedBytes += chunk.length;
      const progress = (uploadedBytes / fileSize) * 100;
      // Envia o progresso para o cliente
      res.write(chunk);
    });

    readStream.on('end', () => {
      res.end();
    });

    readStream.on('error', (err) => {
      console.error(err);
      res.status(500).end();
    });
    // res.download(path.join(ANIME_PATH,aniId,"seasons",seasonId,epId,`${epId}-${reso}.mp4`))
  }catch(err){
    sendError(res,ErrorType.default,500,err)
  }
})
router.get("/g/aniD/:ani/:seasonId/:epId",async(req,res)=>{
  try{
    var {ani,seasonId,epId} = req.params
    if(!ani||!seasonId||!epId){
      throw ErrorType.undefined
    }
    var result = await req.db.execute(`SELECT name, seasons FROM anime WHERE id = ?`,[ani],{prepare:true})
    var seasons = tupleToSeason(result.rows[0].seasons)
    Console.log(result.rows[0].seasons,seasons,seasons.find((v)=>v.id == seasonId))
    var episode = await req.db.execute(`SELECT name, resolution FROM episodes WHERE id = ?`,[epId])
    res.json({
      aniName:result.rows[0].name,
      seasonName:seasons.find((v)=>v.id ==seasonId)!.name,
      episodeName:episode.rows[0].name,
      episodeResolution:episode.rows[0].resolution
    })
  }catch(err){
    switch(err){
      case ErrorType.undefined:
        sendError(res,ErrorType.undefined)
        break
      default:
        sendError(res,ErrorType.default,500,err)
        break
    }
  }
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
router.post("/user/anime/like",checkToken,async(req,res)=>{
  try{

  }catch(err){
    sendError(res,ErrorType.default,500,err)
  }
})
router.get("/user/list/checkanime/:id",checkToken,async(req,res)=>{
    try{
        let checkIfExists = await animeClient.query(`
            SELECT COUNT(*) AS num_animes
            FROM users.user_anime_list
            WHERE user_id = $1
            AND anime_id = $2
        `,[(req.user as JwtUser)._id,req.params.id])
        const num_animes = checkIfExists.rows[0].num_animes;
        if(num_animes>0){
            res.json({success:true,message:true})
        }else{
            res.json({success:true,message:false})
        }
    }catch(err){
        sendError(res,ErrorType.default,500,err)
    }
})
router.post("/user/anime/add/:id",checkToken,async(req,res)=>{
  try{
    Console.log(req.user)
    let anime = (await req.db.execute(`SELECT name FROM anime WHERE id = ?`,[req.params.id],{prepare:true})).rows[0]
    // anime.rows[0].name;
    let checkIfExists = await animeClient.query(`
        SELECT COUNT(*) AS num_animes
        FROM users.user_anime_list
        WHERE user_id = $1
        AND anime_id = $2
    `,[(req.user as JwtUser)._id,req.params.id])
    const num_animes = checkIfExists.rows[0].num_animes;
    if(num_animes>0){
        return res.status(403).json({success:false,message:"Anime ja existe na sua lista"})
    }
    let result = await animeClient.query(`
    INSERT INTO users.user_anime_list (
        user_id,
        anime_id,
        status,
        name,
        start_date,
        finish_date,
        rate,
        times_watched,
        priority,
        rewatched_episodes
    ) VALUES(
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        $9,
        $10
    ) RETURNING TRUE

    `,[
        (req.user as JwtUser)._id,
        req.params.id,
        Object.keys(userAnimeState)[0],
        anime.name,
        new Date(Date.now()),
        null,
        0.0,
        0,
        Object.keys(priorityValue)[0],
        0
    ])
    Console.log(result.rows)
    if(result.rows.length>0){
        res.status(201).json({success:true,message:"Anime adicionado a lista de anime"})
    }else{
        return res.status(500).json({success:false,message:"Falha ao adicionar anime na sua lista"})
    }
  }catch(err){
    sendError(res,ErrorType.default,500,err)
  }
})
router.get('/user/anime',checkToken,async(req,res)=>{
  try{
    animeClient.query(`
      
    `)
  }catch(err){
    sendError(res,ErrorType.default,500,err)
  }
})
router.post("/new/user",async(req,res)=>{
  try{
    const { email, name, surname, username, birthDate, password, recaptchaToken, salt} = req.body;
    if(!recaptchaToken){
      throw ErrorType.noToken
    }
    const emailRegex = /\S+@\S+\.\S+/;
    if(!emailRegex.test(email)){
      throw ErrorType.invalidEmail
    }
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify',{
      method:"POST",
      headers:{
        'Content-Type':'application/x-www-form-urlencoded',
      },
      body: `secret=${reCaptchaSecretKey}&response=${recaptchaToken}`
    })
    const data = await response.json()
    if(data.success){
      let userData = {
        name,
        email,
        surname,
        username,
        birthDate,
        password,
        salt
      }
      await addUser(userData)

      return res.send(200).json({success:true,message: 'Usuário registrado com sucesso' })
    }else{
      throw ErrorType.invalidReCaptcha
    }
  }catch(err:any|ErrorType){
    switch(err){
      case ErrorType.noToken:
        sendError(res,ErrorType.noToken);
        break
      case ErrorType.invalidToken:
        sendError(res,ErrorType.invalidReCaptcha)
        break
      case ErrorType.invalidEmail:
        sendError(res,ErrorType.invalidEmail)
        break
      default:
        sendError(res,ErrorType.default,500,err)
    }
  }
})
router.get("/user/animelist/:id",checkToken,async(req,res)=>{
  try{
    // Console.log((req.user as JwtUser)._id,req.params.id)
    let result = await animeClient.query(`
      SELECT *
      FROM users.user_anime_list
      WHERE user_id = $1
      AND anime_id = $2;
    `,[(req.user as JwtUser)._id,req.params.id])
    res.json(result.rows)
  }catch(err){
    sendError(res,ErrorType.default,500,err)
  }
})
router.get("/user/animelist",checkToken,async(req,res)=>{
  try{
    let result = await animeClient.query(`
        SELECT user_id, anime_id, status, name, start_date, finish_date, rate, times_watched, priority, rewatched_episodes, last_ep, id
        FROM users.user_anime_list
        WHERE user_id = $1;
  `,[(req.user as JwtUser)._id])
  res.send(result.rows)
  }catch(err){
    sendError(res,ErrorType.default,500,err)
  }
})
app.get('/g/checktoken',checkToken,(req,res)=>{
  res.json({success:true})
})
app.get('/g/user',checkToken,async(req,res)=>{
  try{
    console.log(req.user)
    console.log(req.headers)
    console.log(req.cookies)
    let result = await animeClient.query(`
      SELECT _id, name, surname, username, birthdate, email, totalanime, totalanimewatching, totalanimecompleted, totalanimedropped, totalanimeplantowatch, role, totalmanga, totalmangareading, totalmangacompleted, totalmangadropped, totalmangaplantoread, totalanimeliked, totalmangaliked,totalanimeonhold,totalmangaonhold
      FROM users.users
      WHERE _id = $1;
    `,[(req.user as JwtUser)._id])
    if(result.rows.length < 1){
      throw ErrorType.invalidPassOrEmail
    }
    res.send(result.rows[0])
  }catch(err){
    switch(err){
      case ErrorType.noToken:
        sendError(res,ErrorType.noToken)
        break
      default:
        sendError(res,ErrorType.default,500,err)
        break
    }
  }
})

app.use('/api',router)

app.use(e.static(BUILD_PATH,{ maxAge: '1d' }))
app.post('/login/',async(req,res)=>{
  try{
    const {email,password,recaptchaToken} = req.body;
    if(!recaptchaToken){
      throw ErrorType.invalidReCaptcha
    }
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify',{
      method:"POST",
      headers:{
        'Content-Type':'application/x-www-form-urlencoded',
      },
      body: `secret=${reCaptchaSecretKey}&response=${recaptchaToken}`
    })
    const data = await response.json()
    if(data.success){
      let result = await animeClient.query(`
        WITH hashed_password AS (
          SELECT users.crypt($1, salt) AS hash
          FROM users.users
          WHERE email = $2
        )
        SELECT * FROM users.users
        WHERE email = $2 AND password = (SELECT hash FROM hashed_password)
      `,[password,email])
      Console.log(result.rows)
      if(result.rows.length < 1){
        throw ErrorType.invalidPassOrEmail
      }
      const token = jwt.sign({_id:result.rows[0]._id,username:result.rows[0].username},secretKey,{expiresIn:"1d"})
      res.cookie('token',token,{httpOnly:true,secure:true})
      res.send({success:true,message:"Login Successful",token})
    }else{
      throw ErrorType.invalidReCaptcha
    }
    

  }catch(err){
    switch(err){
      case ErrorType.invalidReCaptcha:
        sendError(res,ErrorType.invalidReCaptcha)
        break
      case ErrorType.invalidToken:
        sendError(res,ErrorType.invalidToken)
        break
      case ErrorType.noToken:
        sendError(res,ErrorType.noToken)
        break
      case ErrorType.invalidPassOrEmail:
        sendError(res,ErrorType.invalidPassOrEmail)
        break
      default:
        sendError(res,ErrorType.default,500,err)
        break
    }
  }
})
app.post('/logout',async(req,res)=>{
  try{
    res.clearCookie('token')
    res.json({success:true,message:"Logout successful"})
  }catch(err){
    sendError(res,ErrorType.default,500,err)
  }
  
})

app.get('*',(req:e.Request,res:e.Response)=>{
    sendFile().cssJs(res)
    res.sendFile(BUILD_HTML)
})




// app.listen(80,"0.0.0.0",()=>{
//   console.log("Aberto em 0.0.0.0")
// })

httpsServer.listen(4433,"0.0.0.0",()=>{
    Console.log(`http://0.0.0.0:4433`)
})