"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var e = require("express");
// import * as ip from 'ip'
var path = require("path");
var fs = require("fs");
// import * as https from "https"
var http = require("http");
var body_parser_1 = require("body-parser");
// import mongoose from "mongoose"
// import * as nano from "nano"
// const Nano = require('nano');
// import { Anime } from '../../app_admin/src/types/animeModel'
var handle_1 = require("./assets/handle");
var pool_1 = require("./assets/pool");
var consts_1 = require("./consts");
var cassandra_driver_1 = require("cassandra-driver");
var animeFunctions_1 = require("../src/functions/animeFunctions");
var sleep = require("sleep-promise");
// const privateKey = fs.readFileSync(HTTPS_KEY_PATH, 'utf8');
// const certificate = fs.readFileSync(HTTPS_CERT_PATH, 'utf8');
// const credentials = { key: privateKey, cert: certificate };
var app = e();
// const ip_1 = ip.address("Radmin VPN")
// const ip_2 = ip.address("Ethernet")
// const mongoUri = `mongodb://${ip_1}:211/data`
// const couch:nano.ServerScope = Nano('http://admin:285@127.0.0.1:5984');
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
app.use((0, body_parser_1.json)());
app.use((0, body_parser_1.urlencoded)({ extended: true }));
var httpsServer = http.createServer(app);
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
var router = e.Router();
router.use(function (req, res, next) {
    pool_1.client.connect()
        .then(function () {
        req.db = pool_1.client;
        next();
    })
        .catch(function (err) {
        handle_1.Console.error(err);
        (0, handle_1.sendError)(res, handle_1.ErrorType.default, 500, "Erro na database");
    });
});
router.get('/ani/lan', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var query, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                (0, handle_1.setHeader)(res);
                res.setHeader("Cache-Control", "public, max-age:60");
                query = "SELECT id, name, description, genre, averageeptime FROM anime;";
                return [4 /*yield*/, req.db.execute(query).then(function (v) {
                        handle_1.Console.log(v.rows);
                        res.send(v.rows);
                    }).catch(function (err) {
                        throw new Error(err);
                    })];
            case 1:
                _a.sent();
                return [3 /*break*/, 3];
            case 2:
                err_1 = _a.sent();
                handle_1.Console.error(err_1);
                (0, handle_1.sendError)(res, handle_1.ErrorType.undefined);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get('/ani/img', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        (0, handle_1.setHeader)(res);
        try {
            if (req.query.Id == null || req.query.Id == undefined) {
                throw 1;
            }
            (0, handle_1.sendFile)().img(res);
            res.sendFile(path.join(consts_1.ANIME_PATH, req.query.Id, "img", "".concat(req.query.Id, ".jpg")));
        }
        catch (err) {
            if (err == 1) {
                (0, handle_1.sendError)(res, handle_1.ErrorType.undefined);
            }
            else if (err == 2) {
                (0, handle_1.sendError)(res, handle_1.ErrorType.NotId);
            }
        }
        return [2 /*return*/];
    });
}); });
router.get("/g/eps/:animeId/:seasonId/:ep", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var ep, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                if (!req.params.animeId || !req.params.seasonId || !req.params.ep) {
                    throw handle_1.ErrorType.undefined;
                }
                return [4 /*yield*/, req.db.execute("SELECT * FROM episodes WHERE animeid = ? AND seasonid = ? AND id = ? ALLOW FILTERING;", [req.params.animeId, req.params.seasonId, req.params.ep], { prepare: true })];
            case 1:
                ep = _a.sent();
                res.send(ep.rows[0]);
                return [3 /*break*/, 3];
            case 2:
                err_2 = _a.sent();
                switch (err_2) {
                    case handle_1.ErrorType.undefined:
                        (0, handle_1.sendError)(res, handle_1.ErrorType.undefined, 400, "");
                        break;
                    default:
                        (0, handle_1.sendError)(res, handle_1.ErrorType.default, 500, err_2);
                }
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get("/ani/agenda", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var resp, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, req.db.execute("SELECT id, name, description,rating, weekday FROM anime WHERE state = 'Lan\u00E7ando' ALLOW FILTERING")];
            case 1:
                resp = _a.sent();
                console.log(resp.rows);
                res.send(resp.rows);
                return [3 /*break*/, 3];
            case 2:
                err_3 = _a.sent();
                (0, handle_1.sendError)(res, handle_1.ErrorType.default, 500, err_3);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get("/ani/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var query, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                query = "SELECT * FROM anime WHERE id = ".concat(req.params.id, ";");
                return [4 /*yield*/, req.db.execute(query).then(function (v) {
                        (0, handle_1.setHeader)(res);
                        handle_1.Console.log(v.rows[0]);
                        res.send(v.rows[0]);
                    }).catch(function (err) {
                        handle_1.Console.log(err);
                        throw new Error(err);
                    })];
            case 1:
                _a.sent();
                return [3 /*break*/, 3];
            case 2:
                err_4 = _a.sent();
                (0, handle_1.sendError)(res, handle_1.ErrorType.NotId);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.get("/ani/season/", function (req, res) {
    try {
        // setHeader(res)
        var GetCurrentSeason = req.get("GetCurrentSeason");
        //console.log(GetCurrentSeason, typeof GetCurrentSeason);
        if (GetCurrentSeason == "false") {
            var m = parseInt(req.query.month);
            var y = req.query.year;
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
    }
    catch (err) {
        (0, handle_1.sendError)(res, handle_1.ErrorType.default, 500, "Error while getting release season");
    }
});
router.get("/ani/gen/:gen", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var docs, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, req.db.execute("SELECT id, name, description,rating FROM anime WHERE genre CONTAINS ?", [req.params.gen], { prepare: true })];
            case 1:
                docs = _a.sent();
                res.send(docs.rows);
                return [3 /*break*/, 3];
            case 2:
                err_5 = _a.sent();
                (0, handle_1.sendError)(res, handle_1.ErrorType.default, 500, err_5);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
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
router.get('/search', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var search, result, err_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                search = req.query.s;
                handle_1.Console.log(search);
                return [4 /*yield*/, req.db.execute("SELECT id, name, description,rating FROM anime WHERE name LIKE '%".concat(search, "%' OR name2 LIKE '%").concat(search, "%' ALLOW FILTERING"), [], { prepare: true })];
            case 1:
                result = _a.sent();
                res.send(result.rows);
                return [3 /*break*/, 3];
            case 2:
                err_6 = _a.sent();
                (0, handle_1.sendError)(res, handle_1.ErrorType.default, 500, err_6);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get("/g/s/eps/:animeid/:seasonid", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, animeid, seasonid, result, err_7;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.params, animeid = _a.animeid, seasonid = _a.seasonid;
                return [4 /*yield*/, req.db.execute("SELECT * FROM episodes WHERE animeid = ? AND seasonid = ? ALLOW FILTERING", [cassandra_driver_1.types.Uuid.fromString(animeid), cassandra_driver_1.types.Uuid.fromString(seasonid)])];
            case 1:
                result = _b.sent();
                return [4 /*yield*/, sleep(50)];
            case 2:
                _b.sent();
                handle_1.Console.log(result.rows);
                res.send(result.rows);
                return [3 /*break*/, 4];
            case 3:
                err_7 = _b.sent();
                (0, handle_1.sendError)(res, handle_1.ErrorType.default, 500, err_7);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get("/g/eps", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var count, eps, currentDate, semana, result, err_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                count = req.query.count;
                eps = [];
                currentDate = new Date();
                semana = new Date(currentDate.valueOf() - 7 * 24 * 60 * 60 * 1000);
                return [4 /*yield*/, req.db.execute("SELECT id, animeid, seasonid, name, duration, resolution, date_added FROM episodes WHERE date_added >= ? LIMIT ? ALLOW FILTERING;", [semana, count], { prepare: true })];
            case 1:
                result = _a.sent();
                handle_1.Console.log(result);
                return [4 /*yield*/, sleep(2)];
            case 2:
                _a.sent();
                result.rows.forEach(function (ee) { return __awaiter(void 0, void 0, void 0, function () {
                    var id, animeid, seasonid, name, duration, resolution, date_added, aniS, ep;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                id = ee.id, animeid = ee.animeid, seasonid = ee.seasonid, name = ee.name, duration = ee.duration, resolution = ee.resolution, date_added = ee.date_added;
                                return [4 /*yield*/, req.db.execute("SELECT name FROM anime WHERE id = ?", [animeid], { prepare: true })
                                    // Console.log(aniS)
                                ];
                            case 1:
                                aniS = _b.sent();
                                // Console.log(aniS)
                                return [4 /*yield*/, sleep(20)];
                            case 2:
                                // Console.log(aniS)
                                _b.sent();
                                ep = {
                                    id: id,
                                    animeid: animeid,
                                    seasonid: seasonid,
                                    name: name,
                                    duration: duration,
                                    resolution: resolution,
                                    animename: (_a = aniS.rows[0]) === null || _a === void 0 ? void 0 : _a.name,
                                    // seasonname:season.name,
                                    date_added: new Date(date_added)
                                };
                                // console.log(ep)
                                eps.push(ep);
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [4 /*yield*/, sleep(20)];
            case 3:
                _a.sent();
                eps.sort(function (a, b) { return new Date(b.date_added).valueOf() - new Date(a.date_added).valueOf(); });
                return [4 /*yield*/, sleep(20)];
            case 4:
                _a.sent();
                res.send(eps);
                return [3 /*break*/, 6];
            case 5:
                err_8 = _a.sent();
                (0, handle_1.sendError)(res, handle_1.ErrorType.default, 500, err_8);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
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
router.get("/g/ep/download/:aniId/:seasonId/:epId/:reso", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, aniId, seasonId, epId, reso, filePath, stat, fileSize_1, readStream, uploadedBytes_1;
    return __generator(this, function (_b) {
        try {
            _a = req.params, aniId = _a.aniId, seasonId = _a.seasonId, epId = _a.epId, reso = _a.reso;
            filePath = path.join(consts_1.ANIME_PATH, aniId, "seasons", seasonId, epId, "".concat(epId, "-").concat(reso, ".mp4"));
            stat = fs.statSync(filePath);
            fileSize_1 = stat.size;
            readStream = fs.createReadStream(filePath);
            res.setHeader('Content-Type', 'video/mp4');
            res.setHeader('Content-Length', fileSize_1);
            res.setHeader('Content-Disposition', "attachment; filename=".concat(epId, ".mp4"));
            uploadedBytes_1 = 0;
            readStream.on('data', function (chunk) {
                uploadedBytes_1 += chunk.length;
                var progress = (uploadedBytes_1 / fileSize_1) * 100;
                // Envia o progresso para o cliente
                res.write(chunk);
            });
            readStream.on('end', function () {
                res.end();
            });
            readStream.on('error', function (err) {
                console.error(err);
                res.status(500).end();
            });
            // res.download(path.join(ANIME_PATH,aniId,"seasons",seasonId,epId,`${epId}-${reso}.mp4`))
        }
        catch (err) {
            (0, handle_1.sendError)(res, handle_1.ErrorType.default, 500, err);
        }
        return [2 /*return*/];
    });
}); });
router.get("/g/aniD/:ani/:seasonId/:epId", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, ani, seasonId, epId, result, seasons, episode, err_9;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.params, ani = _a.ani, seasonId = _a.seasonId, epId = _a.epId;
                if (!ani || !seasonId || !epId) {
                    throw handle_1.ErrorType.undefined;
                }
                return [4 /*yield*/, req.db.execute("SELECT name, seasons FROM anime WHERE id = ?", [ani], { prepare: true })];
            case 1:
                result = _b.sent();
                seasons = (0, animeFunctions_1.tupleToSeason)(result.rows[0].seasons);
                handle_1.Console.log(result.rows[0].seasons, seasons, seasons.find(function (v) { return v.id == seasonId; }));
                return [4 /*yield*/, req.db.execute("SELECT name, resolution FROM episodes WHERE id = ?", [epId])];
            case 2:
                episode = _b.sent();
                res.json({
                    aniName: result.rows[0].name,
                    seasonName: seasons.find(function (v) { return v.id == seasonId; }).name,
                    episodeName: episode.rows[0].name,
                    episodeResolution: episode.rows[0].resolution
                });
                return [3 /*break*/, 4];
            case 3:
                err_9 = _b.sent();
                switch (err_9) {
                    case handle_1.ErrorType.undefined:
                        (0, handle_1.sendError)(res, handle_1.ErrorType.undefined);
                        break;
                    default:
                        (0, handle_1.sendError)(res, handle_1.ErrorType.default, 500, err_9);
                        break;
                }
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get("/ep/:aniId/:season/:epId/:file", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, aniId, season, epId, file;
    return __generator(this, function (_b) {
        (0, handle_1.setHeader)(res);
        _a = req.params, aniId = _a.aniId, season = _a.season, epId = _a.epId, file = _a.file;
        res.set('Cache-Control', 'public, max-age=7200');
        res.sendFile(path.join(consts_1.ANIME_PATH, aniId, "seasons", season, epId, file));
        return [2 /*return*/];
    });
}); });
router.post("/new/user", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userData, user, err_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userData = req.body;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, handle_1.addUser)(userData)];
            case 2:
                user = _a.sent();
                res.json(user);
                return [3 /*break*/, 4];
            case 3:
                err_10 = _a.sent();
                (0, handle_1.sendError)(res, handle_1.ErrorType.default, 500, err_10);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.post('/log', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var logData, log, err_11;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                logData = req.body;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, handle_1.addLog)(logData)];
            case 2:
                log = _a.sent();
                res.json(log);
                return [3 /*break*/, 4];
            case 3:
                err_11 = _a.sent();
                (0, handle_1.sendError)(res, handle_1.ErrorType.default, 500, err_11);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.post("/new/user", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, name_1, surname, username, birthDate, password, recaptchaToken, response, data, err_12;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, email = _a.email, name_1 = _a.name, surname = _a.surname, username = _a.username, birthDate = _a.birthDate, password = _a.password, recaptchaToken = _a.recaptchaToken;
                if (!recaptchaToken) {
                    throw handle_1.ErrorType.noToken;
                }
                return [4 /*yield*/, fetch('https://www.google.com/recaptcha/api/siteverify', {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: "secret=6LcHpccpAAAAADy0tuoQA__xb-zsWUV-x0ybALSI&response=".concat(recaptchaToken)
                    })];
            case 1:
                response = _b.sent();
                return [4 /*yield*/, response.json()];
            case 2:
                data = _b.sent();
                if (data.success) {
                    return [2 /*return*/, res.send(200).json({ success: true, message: 'Usuário registrado com sucesso' })];
                }
                else {
                    throw handle_1.ErrorType.invalidReCaptcha;
                }
                return [3 /*break*/, 4];
            case 3:
                err_12 = _b.sent();
                switch (err_12) {
                    case handle_1.ErrorType.noToken:
                        (0, handle_1.sendError)(res, handle_1.ErrorType.noToken);
                        break;
                    case handle_1.ErrorType.invalidToken:
                        (0, handle_1.sendError)(res, handle_1.ErrorType.invalidReCaptcha);
                    default:
                        (0, handle_1.sendError)(res, handle_1.ErrorType.default, 500, err_12);
                }
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.use('/api', router);
app.use(e.static(consts_1.BUILD_PATH, { maxAge: '1d' }));
app.get('*', function (req, res) {
    (0, handle_1.sendFile)().cssJs(res);
    res.sendFile(consts_1.BUILD_HTML);
});
// app.listen(80,"0.0.0.0",()=>{
//   console.log("Aberto em 0.0.0.0")
// })
httpsServer.listen(4433, "0.0.0.0", function () {
    handle_1.Console.log("http://0.0.0.0:4433");
});
