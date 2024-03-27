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
var https = require("https");
var body_parser_1 = require("body-parser");
var Nano = require('nano');
var handle_1 = require("./assets/handle");
var pool_1 = require("./assets/pool");
var privateKey = fs.readFileSync(path.join(__dirname, "../", "../", "https", "chave.pem"), 'utf8');
var certificate = fs.readFileSync(path.join(__dirname, "../", "../", "https", 'certificado.pem'), 'utf8');
var credentials = { key: privateKey, cert: certificate };
var app = e();
// const ip_1 = ip.address("Radmin VPN")
// const ip_2 = ip.address("Ethernet")
// const mongoUri = `mongodb://${ip_1}:211/data`
// const couch:nano.ServerScope = Nano('http://admin:285@127.0.0.1:5984');
var animePath = path.join("D:", "main", "server", "Anime");
var mangaPath = path.join("D:", "main", "server", "Manga");
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
            res.sendFile(path.join(animePath, req.query.Id, "img", "".concat(req.query.Id, ".jpg")));
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
router.get("/ani/:id/ass", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var client, query, resultProd, resultCrea, resultStu, ress, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, handle_1.openConnectionAnime)()];
            case 1:
                client = _a.sent();
                _a.label = 2;
            case 2:
                _a.trys.push([2, 6, 7, 9]);
                if (!req.params.id) {
                    throw handle_1.ErrorType.undefined;
                }
                query = {
                    text: "\n      SELECT producer_id\n        FROM animes.anime_producers\n        WHERE anime_id = $1;\n      ",
                    values: [req.params.id]
                };
                return [4 /*yield*/, animeClient.query(query)];
            case 3:
                resultProd = _a.sent();
                query = {
                    text: "\n      SELECT creator_id\n      FROM animes.anime_creators\n      WHERE anime_id = $1;\n      ",
                    values: [req.params.id]
                };
                return [4 /*yield*/, animeClient.query(query)];
            case 4:
                resultCrea = _a.sent();
                query = {
                    text: "\n      SELECT studio_id\n      FROM animes.anime_studios\n      WHERE anime_id = $1;\n      ",
                    values: [req.params.id]
                };
                return [4 /*yield*/, animeClient.query(query)];
            case 5:
                resultStu = _a.sent();
                ress = {
                    producers: resultProd.rows,
                    creators: resultCrea.rows,
                    studios: resultStu.rows
                };
                res.json(ress);
                return [3 /*break*/, 9];
            case 6:
                err_2 = _a.sent();
                switch (err_2) {
                    case handle_1.ErrorType.undefined:
                        (0, handle_1.sendError)(res, handle_1.ErrorType.undefined);
                        break;
                    case handle_1.ErrorType.default:
                        (0, handle_1.sendError)(res, handle_1.ErrorType.default, 500, err_2);
                        break;
                }
                return [3 /*break*/, 9];
            case 7: return [4 /*yield*/, (0, handle_1.endConnectionAnime)(client)];
            case 8:
                _a.sent();
                return [7 /*endfinally*/];
            case 9: return [2 /*return*/];
        }
    });
}); });
router.get("/ani/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var query, err_3;
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
                err_3 = _a.sent();
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
    var agg, docs;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                agg = {
                    selector: {
                        generos: req.params.gen
                    }
                };
                return [4 /*yield*/, couch.use("anime").find(agg)];
            case 1:
                docs = _a.sent();
                res.send(docs);
                return [2 /*return*/];
        }
    });
}); });
router.get('/search', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var search, db, _a, _b, err_4;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                search = req.query.s;
                db = couch.use("anime");
                _b = (_a = handle_1.Console).log;
                return [4 /*yield*/, db.get("_design/search")];
            case 1:
                _b.apply(_a, [_c.sent()]);
                db.view("anime", "search", { include_docs: true, key: { search: search } }, function (err, response) {
                    if (err)
                        throw err;
                    handle_1.Console.log(response);
                    var result = response.rows.map(function (row) { return row.doc; }); // Obtém os documentos da view
                    console.log(result);
                    res.send(result);
                });
                return [3 /*break*/, 3];
            case 2:
                err_4 = _c.sent();
                (0, handle_1.sendError)(res, handle_1.ErrorType.default, 500, err_4);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get("/g/ep/:aniId/:sId/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var doc, s, ep, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, couch.use("anime").get(req.params.aniId)];
            case 1:
                doc = _a.sent();
                s = doc.seasons.find(function (v) { return v._id === req.params.sId; });
                ep = s.episodes.find(function (v) { return v._id === req.params.id; });
                handle_1.Console.log(doc, s, ep);
                handle_1.Console.log(doc.seasons);
                res.send(ep);
                return [3 /*break*/, 3];
            case 2:
                err_5 = _a.sent();
                (0, handle_1.sendError)(res, handle_1.ErrorType.default, 500, err_5);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get("/g/eps", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        // const query = {
        //   text: 'SELECT * FROM public."newEpisodes" WHERE date >= CURRENT_DATE - INTERVAL 7 days',
        //   values: ['7 days'],
        // };
        try {
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
        }
        catch (err) {
            (0, handle_1.sendError)(res, handle_1.ErrorType.default, 500, err);
        }
        return [2 /*return*/];
    });
}); });
// router.get("/ani/char/:aniId/:charId",async(req,res)=>{
//   try{
//     var doc = await couch.use("anime").get(req.params.aniId) as AnimeDocument;
//     var char = doc.characters?.find((v)=>v._id == req.params.charId)
//     res.send(char)
//   }catch(err){
//     sendError(res,ErrorType.default,500,err)
//   }
// })
router.get("/ani/char/:aniId/:charId/img", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var doc, err_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, couch.use("anime").get(req.params.aniId)];
            case 1:
                doc = _a.sent();
                // var char = doc.characters?.find((v)=>v._id == req.params.charId);
                res.sendFile(path.join(doc.path, "characters", req.params.charId, "".concat(req.params.charId, ".jpg")));
                return [3 /*break*/, 3];
            case 2:
                err_6 = _a.sent();
                (0, handle_1.sendError)(res, handle_1.ErrorType.default, 500, err_6);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get("/test", function (req, res) {
    res.sendFile("E:\\main\\app\\src\\test\\test.html");
});
router.get("/css/:file", function (req, res) {
    res.sendFile(path.join("E:\\main\\app\\src\\css", req.params.file));
});
router.get("/ep/:aniId/:season/:epId/:file", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var ani, sea, ep;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                (0, handle_1.setHeader)(res);
                return [4 /*yield*/, couch.use("anime").get(req.params.aniId)];
            case 1:
                ani = _b.sent();
                sea = (_a = ani.seasons) === null || _a === void 0 ? void 0 : _a.find(function (v) { return v._id === req.params.season; });
                ep = sea === null || sea === void 0 ? void 0 : sea.episodes.find(function (v) { return v._id === req.params.epId; });
                res.set('Cache-Control', 'public, max-age=7200');
                // Console.log(ani.path,sea?._id,req.params.epId,req.params.file)
                res.sendFile(path.join(ani.path, "seasons", sea === null || sea === void 0 ? void 0 : sea._id, ep === null || ep === void 0 ? void 0 : ep._id, req.params.file));
                return [2 /*return*/];
        }
    });
}); });
router.post("/new/user", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userData, user, err_7;
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
                err_7 = _a.sent();
                (0, handle_1.sendError)(res, handle_1.ErrorType.default, 500, err_7);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.post('/log', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var logData, log, err_8;
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
                err_8 = _a.sent();
                (0, handle_1.sendError)(res, handle_1.ErrorType.default, 500, err_8);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.use('/api', router);
app.use(e.static(path.join("D:\\main\\app", "build")));
app.get('*', function (req, res) {
    (0, handle_1.sendFile)().cssJs(res);
    res.sendFile(path.join("D:\\main\\app\\build", "index.html"));
});
var httpsServer = https.createServer(credentials, app);
// app.listen(80,"0.0.0.0",()=>{
//   console.log("Aberto em 0.0.0.0")
// })
httpsServer.listen(443, "0.0.0.0", function () {
    handle_1.Console.log("https://0.0.0.0");
});
// httpsServer.listen(443,ip_2,()=>{
//   Console.log(`https://${ip_2}`)
// })
// app.listen(80,ip_2,()=>{
//   Console.log(`http://${ip_2}`)
// })
