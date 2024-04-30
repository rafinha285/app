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
exports.addUser = exports.checkToken = exports.addLog = exports.endConnectionAnime = exports.rollbackAnime = exports.openConnectionAnime = exports.id = exports.mkDir = exports.sendFile = exports.sendError = exports.ErrorType = exports.getTime = exports.cut = exports.setHeader = exports.Console = void 0;
var Console_1 = require("./Console");
var path = require("path");
var Postgre_1 = require("../database/Postgre");
var fs = require('fs');
var ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath("D:/Site_anime/ffmpeg/bin/ffmpeg.exe");
ffmpeg.setFfprobePath("D:/Site_anime/ffmpeg/bin/ffprobe.exe");
var uuid_1 = require("uuid");
var jwt = require("jsonwebtoken");
var config_1 = require("../secret/config");
// import { randomInt } from "crypto";
exports.Console = Console_1.default;
// export const epModel = mongoose.model<episode>('aniEp',aniEpS)
function setHeader(res) {
    res.setHeader('Content-Security-Policy', 'upgrade-insecure-requests');
}
exports.setHeader = setHeader;
function cut(string) {
    var s = string.replace(/[^a-zA-Z0-9-_ ]/g, "");
    return s;
}
exports.cut = cut;
function getTime(path) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            try {
                ffmpeg.ffprobe(path, function (err, data) {
                    if (err)
                        throw err;
                    else {
                        var dur = data.format.duration;
                        return data.format.duration;
                    }
                });
            }
            catch (err) {
                return [2 /*return*/, 0];
            }
            return [2 /*return*/];
        });
    });
}
exports.getTime = getTime;
var ErrorType;
(function (ErrorType) {
    ErrorType[ErrorType["NotId"] = 0] = "NotId";
    ErrorType[ErrorType["Exist"] = 1] = "Exist";
    ErrorType[ErrorType["undefined"] = 2] = "undefined";
    ErrorType[ErrorType["noToken"] = 3] = "noToken";
    ErrorType[ErrorType["invalidToken"] = 4] = "invalidToken";
    ErrorType[ErrorType["invalidReCaptcha"] = 5] = "invalidReCaptcha";
    ErrorType[ErrorType["invalidPassOrEmail"] = 6] = "invalidPassOrEmail";
    ErrorType[ErrorType["invalidEmail"] = 7] = "invalidEmail";
    ErrorType[ErrorType["unauthorized"] = 8] = "unauthorized";
    ErrorType[ErrorType["default"] = 9] = "default";
})(ErrorType || (exports.ErrorType = ErrorType = {}));
function sendError(res, errorType, status, menssage) {
    if (errorType === void 0) { errorType = ErrorType.default; }
    if (status === void 0) { status = 500; }
    if (menssage === void 0) { menssage = ""; }
    function error(res, status, menssage) {
        exports.Console.error(menssage);
        res.status(status).json(menssage);
    }
    function notId(res) {
        exports.Console.error("The ids are not a valid ObjectId or does not exist");
        res.status(400).json("The ids are not a valid ObjectId or does not exist");
    }
    function exist(res) {
        exports.Console.error("The anime already exists");
        res.status(409).json("The anime already exists");
    }
    function und(res) {
        exports.Console.error("Is undefined");
        res.status(400).json("Is undefined");
    }
    function noToken(res) {
        exports.Console.log("No token is provided");
        res.status(401).json({ success: false, mensagem: "No token is provided" });
    }
    function invalidToken(res) {
        exports.Console.log("Invalid Token");
        res.status(403).json({ success: false, mensagem: "Invalid Token" });
    }
    function invalidReCaptcha(res) {
        exports.Console.error("Falha na verificação do reCAPTCHA");
        res.status(400).json({ success: false, message: "Falha na verificação do reCAPTCHA" });
    }
    function invalidPassOrEmail(res) {
        res.status(401).json({ success: false, message: "Falha ao logar, senha ou email incorretos" });
    }
    function invalidEmail(res) {
        res.status(401).json({ success: false, message: "O email n é valido" });
    }
    function unauthorized(res) {
        res.status(401).json({ success: false, message: "Essa operação não é autorizada" });
    }
    switch (errorType) {
        case ErrorType.NotId:
            notId(res);
            break;
        case ErrorType.Exist:
            exist(res);
            break;
        case ErrorType.undefined:
            und(res);
            break;
        case ErrorType.noToken:
            noToken(res);
            break;
        case ErrorType.invalidToken:
            invalidToken(res);
            break;
        case ErrorType.invalidReCaptcha:
            invalidReCaptcha(res);
            break;
        case ErrorType.invalidPassOrEmail:
            invalidPassOrEmail(res);
            break;
        case ErrorType.unauthorized:
            unauthorized(res);
            break;
        case ErrorType.default:
            error(res, status, menssage);
            break;
    }
}
exports.sendError = sendError;
function sendFile() {
    function cssJs(res) {
        res.set('Cache-Control', 'public, max-age=31536000').set('Age', '262968');
    }
    function img(res) {
        res.set('Cache-Control', 'public, max-age=86400').set('Age', '262968');
    }
    return {
        cssJs: cssJs,
        img: img
    };
}
exports.sendFile = sendFile;
// sendErr.prototype
function mkDir(no, svData) {
    return __awaiter(this, void 0, void 0, function () {
        var nom, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    nom = cut(no.toString());
                    exports.Console.log(nom);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fs.mkdirSync(path.join(svData, nom, "Seasons"), { recursive: true })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, fs.mkdirSync(path.join(svData, nom, "Img"), { recursive: true })
                        // await checkSeason(data.content.Seasons,svData)
                    ];
                case 3:
                    _a.sent();
                    // await checkSeason(data.content.Seasons,svData)
                    exports.Console.log("Criado pastas");
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _a.sent();
                    exports.Console.error(err_1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.mkDir = mkDir;
function id(num) {
    if (num === void 0) { num = 8; }
    if (!Number.isNaN(num)) {
        var buffer = new Uint8Array(num / 2);
        crypto.getRandomValues(buffer);
        return Array.from(buffer, function (byte) { return byte.toString(16).padStart(2, '0'); }).join('');
    }
    else {
        return false;
    }
}
exports.id = id;
// export async function checkSeason(Seasons:Season[],pathToVid:string){
//     var dirs = await fs.readdir(path.join(pathToVid,"Seasons"))
//     for(let i = 0; i< dirs.length;i++){
//         var pathDir = path.join(pathToVid,"Seasons",dirs[i])
//         // var b = await Seasons.find((e) => e=== dirs[i])
//         var stat = await fs.lstat(pathDir)
//         if(stat.isDirectory()){
//             if(!fs.existsSync(pathDir)){
//                 await fs.mkdir(pathDir)
//             }
//         }
//     }
//     for(let i = 0; i< Seasons.length;i++){
//         var pathDir = path.join(pathToVid, "Seasons", cut(Seasons[i].Name));
//         var b = await fs.exists(pathDir)
//         if(!b){
//             await fs.mkdir(pathDir)
//         }
//     }
//     for(let i = 0;i< dirs.length;i++){
//         var pathDir = path.join(pathToVid, "Seasons", dirs[i])
//         if(fs.existsSync(pathDir)&& !Seasons.some((e)=> e === dirs[i])){
//             fs.removeSync(pathDir)
//         }
//     }
// }
function openConnectionAnime() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Postgre_1.animeClient.connect()
                    // await animeClient.query("BEGIN")
                ];
                case 1: return [2 /*return*/, _a.sent()
                    // await animeClient.query("BEGIN")
                ];
            }
        });
    });
}
exports.openConnectionAnime = openConnectionAnime;
function commitAnime() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Postgre_1.animeClient.query("COMMIT")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function rollbackAnime() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Postgre_1.animeClient.query("ROLLBACK")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.rollbackAnime = rollbackAnime;
function endConnectionAnime(client) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            client.release();
            return [2 /*return*/];
        });
    });
}
exports.endConnectionAnime = endConnectionAnime;
function addLog(log) {
    return __awaiter(this, void 0, void 0, function () {
        var date, page, duration, ep, anime, manga, _id, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    date = log.date, page = log.page, duration = log.duration, ep = log.ep;
                    anime = log.anime ? log.anime : "";
                    manga = log.manga ? log.manga : "";
                    _id = (0, uuid_1.v4)();
                    exports.Console.log([_id, new Date(date).toISOString(), anime, manga, page, duration, ep]);
                    return [4 /*yield*/, Postgre_1.logPool.query('INSERT INTO log (date, anime, manga, page, duration, ep) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [new Date(date).toISOString(), anime, manga, page, duration, ep])];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result.rows[0]];
            }
        });
    });
}
exports.addLog = addLog;
function checkToken(req, res, next) {
    var token = req.headers.authorization;
    console.log(token);
    var segredo = config_1.secretKey;
    if (!token) {
        sendError(res, ErrorType.noToken);
        return;
    }
    jwt.verify(token, segredo, function (err, usuario) {
        if (err) {
            sendError(res, ErrorType.invalidToken);
            return;
        }
        if (typeof usuario === 'string') {
            try {
                // Decodifica o token JWT para obter as informações do usuário
                var decodedToken = jwt.verify(usuario, segredo);
                if (decodedToken) {
                    req.user = decodedToken;
                }
                else {
                    req.user = usuario;
                }
            }
            catch (error) {
                req.user = usuario;
            }
        }
        else {
            req.user = usuario;
        }
        next();
    });
}
exports.checkToken = checkToken;
function addUser(user) {
    return __awaiter(this, void 0, void 0, function () {
        var name, surname, username, birthDate, email, password, salt, _id, totalAnime, totalAnimeWatching, totalAnimeCompleted, totalAnimeDropped, totalAnimePlanToWatch, totalAnimeLiked, totalManga, totalMangaReading, totalMangaCompleted, totalMangaDropped, totalMangaPlanToRead, totalMangaLiked, animeList, mangaList, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    name = user.name, surname = user.surname, username = user.username, birthDate = user.birthDate, email = user.email, password = user.password, salt = user.salt;
                    console.log(salt);
                    _id = (0, uuid_1.v4)();
                    totalAnime = 0;
                    totalAnimeWatching = 0;
                    totalAnimeCompleted = 0;
                    totalAnimeDropped = 0;
                    totalAnimePlanToWatch = 0;
                    totalAnimeLiked = 0;
                    totalManga = 0;
                    totalMangaReading = 0;
                    totalMangaCompleted = 0;
                    totalMangaDropped = 0;
                    totalMangaPlanToRead = 0;
                    totalMangaLiked = 0;
                    animeList = [];
                    mangaList = [];
                    return [4 /*yield*/, Postgre_1.animeClient.query("INSERT INTO users.users \n        (\n            _id, \n            username, \n            email, \n            password, \n            name, \n            surname, \n            birthdate, \n            totalAnime, \n            totalAnimeWatching, \n            totalAnimeCompleted, \n            totalAnimeDropped, \n            totalAnimePlanToWatch, \n            totalManga, \n            totalMangaReading,\n            totalMangaCompleted, \n            totalMangaDropped, \n            totalMangaPlanToRead, \n            animeList, \n            mangaList, \n            totalAnimeLiked, \n            totalMangaLiked,\n            salt\n        ) \n        VALUES \n        (\n            $1, \n            $2, \n            $3, \n            $4, \n            $5, \n            $6, \n            $7, \n            $8, \n            $9, \n            $10, \n            $11, \n            $12, \n            $13, \n            $14, \n            $15, \n            $16, \n            $17, \n            $18, \n            $19, \n            $20, \n            $21,\n            $22\n        ) RETURNING *", [
                            _id, username, email, password, name, surname, new Date(birthDate).toISOString(),
                            totalAnime, totalAnimeWatching, totalAnimeCompleted, totalAnimeDropped, totalAnimePlanToWatch,
                            totalManga, totalMangaReading, totalMangaCompleted, totalMangaDropped, totalMangaPlanToRead,
                            animeList || [],
                            mangaList || [],
                            totalAnimeLiked || [],
                            totalMangaLiked || [],
                            salt
                        ])];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result.rows[0]];
            }
        });
    });
}
exports.addUser = addUser;
