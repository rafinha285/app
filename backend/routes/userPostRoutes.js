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
var handle_1 = require("../assets/handle");
var config_1 = require("../secret/config");
var Postgre_1 = require("../database/Postgre");
var uuid_1 = require("uuid");
// import * as crypto from 'crypto'
var insertToken_1 = require("../token/insertToken");
var deleteToken_1 = require("../token/deleteToken");
var userPostRouter = e.Router();
userPostRouter.post("/login", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, recaptchaToken, userAgent, timeZone, WebGLVendor, WebGLRenderer, response, data, result, tokenInfo, token, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                console.log(typeof handle_1.ErrorType);
                _a = req.body, email = _a.email, password = _a.password, recaptchaToken = _a.recaptchaToken, userAgent = _a.userAgent, timeZone = _a.timeZone, WebGLVendor = _a.WebGLVendor, WebGLRenderer = _a.WebGLRenderer;
                return [4 /*yield*/, fetch('https://www.google.com/recaptcha/api/siteverify', {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: "secret=".concat(config_1.reCaptchaSecretKey, "&response=").concat(recaptchaToken)
                    })];
            case 1:
                response = _b.sent();
                return [4 /*yield*/, response.json()
                    // if(data.success){
                ];
            case 2:
                data = _b.sent();
                return [4 /*yield*/, Postgre_1.pgClient.query("\n                WITH hashed_password AS (\n                    SELECT users.crypt($1, salt) AS hash\n                    FROM users.users\n                    WHERE email = $2\n                )\n                SELECT * FROM users.users\n                WHERE email = $2 AND password = (SELECT hash FROM hashed_password)\n                ", [password, email])
                    // Console.log(result.rows)
                ];
            case 3:
                result = _b.sent();
                // Console.log(result.rows)
                if (result.rows.length < 1) {
                    throw handle_1.ErrorType.invalidPassOrEmail;
                }
                tokenInfo = {
                    _id: result.rows[0]._id,
                    username: result.rows[0].username,
                    user_agent: userAgent,
                    time_zone: timeZone,
                    web_gl_vendor: WebGLVendor,
                    web_gl_renderer: WebGLRenderer,
                };
                return [4 /*yield*/, (0, insertToken_1.default)(req, tokenInfo)
                    // const token = jwt.sign(tokenInfo,await importPrivateKey(),{expiresIn:"1d"})
                ];
            case 4:
                token = _b.sent();
                // const token = jwt.sign(tokenInfo,await importPrivateKey(),{expiresIn:"1d"})
                res.cookie('token', token, { httpOnly: true, secure: true });
                res.send({ success: true, message: "Login Successful", token: token });
                return [3 /*break*/, 6];
            case 5:
                err_1 = _b.sent();
                switch (err_1) {
                    case handle_1.ErrorType.invalidReCaptcha:
                        (0, handle_1.sendError)(res, handle_1.ErrorType.invalidReCaptcha);
                        break;
                    case handle_1.ErrorType.invalidToken:
                        (0, handle_1.sendError)(res, handle_1.ErrorType.invalidToken);
                        break;
                    case handle_1.ErrorType.noToken:
                        (0, handle_1.sendError)(res, handle_1.ErrorType.noToken);
                        break;
                    case handle_1.ErrorType.invalidPassOrEmail:
                        (0, handle_1.sendError)(res, handle_1.ErrorType.invalidPassOrEmail);
                        break;
                    default:
                        (0, handle_1.sendError)(res, handle_1.ErrorType.default, 500, err_1);
                        break;
                }
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
//TODO colocar o recaptcha no app
//nao da pra deixar essa requisição sem segurança aberta assim
//terminar como o sistema de cima
userPostRouter.post('/app/login', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, result, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, email = _a.email, password = _a.password;
                return [4 /*yield*/, Postgre_1.pgClient.query("\n            WITH hashed_password AS (\n                SELECT users.crypt($1,salt) AS hash\n                FROM users.users\n                WHERE email = $2\n            )\n            SELECT * FROM users.users\n            WHERE email = $2 AND password = (SELECT hash FROM hashed_password)\n        ", [password, email])
                    // Console.log(result.rows)
                ];
            case 1:
                result = _b.sent();
                // Console.log(result.rows)
                if (result.rows.length < 1) {
                    throw handle_1.ErrorType.invalidPassOrEmail;
                }
                return [3 /*break*/, 3];
            case 2:
                err_2 = _b.sent();
                switch (err_2) {
                    case handle_1.ErrorType.invalidToken:
                        (0, handle_1.sendError)(res, handle_1.ErrorType.invalidToken);
                        break;
                    case handle_1.ErrorType.noToken:
                        (0, handle_1.sendError)(res, handle_1.ErrorType.noToken);
                        break;
                    case handle_1.ErrorType.invalidPassOrEmail:
                        (0, handle_1.sendError)(res, handle_1.ErrorType.invalidPassOrEmail);
                        break;
                    default:
                        (0, handle_1.sendError)(res, handle_1.ErrorType.default, 500, err_2);
                        break;
                }
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
//Rota para deslogar o cliente
userPostRouter.post('/logout', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                //TODO fazer um jeito de o jwt destruir o token quando ele sai pelo logout
                // provavelmente mais facil e seguro fazer no pg, tem q ver se nao vai usar muita memoria para isso
                return [4 /*yield*/, (0, deleteToken_1.default)(req)];
            case 1:
                //TODO fazer um jeito de o jwt destruir o token quando ele sai pelo logout
                // provavelmente mais facil e seguro fazer no pg, tem q ver se nao vai usar muita memoria para isso
                _a.sent();
                handle_1.Console.log('logout', req.user);
                res.clearCookie('token');
                res.json({ success: true, message: "Logout successful" });
                return [3 /*break*/, 3];
            case 2:
                err_3 = _a.sent();
                (0, handle_1.sendError)(res, handle_1.ErrorType.default, 500, err_3);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
//Rota para criar um usuario novo
userPostRouter.post('/new/user', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, name_1, surname, username, birthDate, password, recaptchaToken, salt, emailRegex, response, data, _id, totalAnime, totalAnimeWatching, totalAnimeCompleted, totalAnimeDropped, totalAnimePlanToWatch, totalAnimeOnHold, totalAnimeLiked, totalManga, totalMangaReading, totalMangaCompleted, totalMangaDropped, totalMangaPlanToRead, totalMangaOnHold, totalMangaLiked, result, err_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 6, , 7]);
                handle_1.Console.log(req.body);
                _a = req.body, email = _a.email, name_1 = _a.name, surname = _a.surname, username = _a.username, birthDate = _a.birthDate, password = _a.password, recaptchaToken = _a.recaptchaToken, salt = _a.salt;
                if (!recaptchaToken) {
                    throw handle_1.ErrorType.noToken;
                }
                emailRegex = /\S+@\S+\.\S+/;
                if (!emailRegex.test(email)) {
                    throw handle_1.ErrorType.invalidEmail;
                }
                return [4 /*yield*/, fetch('https://www.google.com/recaptcha/api/siteverify', {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: "secret=".concat(config_1.reCaptchaSecretKey, "&response=").concat(recaptchaToken)
                    })];
            case 1:
                response = _b.sent();
                return [4 /*yield*/, response.json()];
            case 2:
                data = _b.sent();
                if (!data.success) return [3 /*break*/, 4];
                _id = (0, uuid_1.v4)();
                totalAnime = 0;
                totalAnimeWatching = 0;
                totalAnimeCompleted = 0;
                totalAnimeDropped = 0;
                totalAnimePlanToWatch = 0;
                totalAnimeOnHold = 0;
                totalAnimeLiked = 0;
                totalManga = 0;
                totalMangaReading = 0;
                totalMangaCompleted = 0;
                totalMangaDropped = 0;
                totalMangaPlanToRead = 0;
                totalMangaOnHold = 0;
                totalMangaLiked = 0;
                handle_1.Console.log([
                    _id, username, email, password, name_1, surname, new Date(birthDate).toISOString(),
                    totalAnime, totalAnimeWatching, totalAnimeCompleted, totalAnimeDropped, totalAnimePlanToWatch,
                    totalManga, totalMangaReading, totalMangaCompleted, totalMangaDropped, totalMangaPlanToRead,
                    totalAnimeLiked || [],
                    totalMangaLiked || [],
                    salt,
                    totalAnimeOnHold,
                    totalMangaOnHold
                ]);
                return [4 /*yield*/, Postgre_1.pgClient.query("INSERT INTO users.users \n                (\n                    _id, \n                    username, \n                    email, \n                    password, \n                    name, \n                    surname, \n                    birthdate, \n                    totalanime, \n                    totalanimewatching, \n                    totalanimecompleted, \n                    totalanimedropped, \n                    totalanimeplantowatch, \n                    totalmanga, \n                    totalmangareading,\n                    totalmangacompleted, \n                    totalmangadropped, \n                    totalmangaplantoread, \n                    totalAnimeLiked, \n                    totalMangaLiked,\n                    salt,\n                    totalanimeonhold,\n                    totalmangaonhold\n                ) \n                VALUES \n                (\n                    $1, \n                    $2, \n                    $3, \n                    $4, \n                    $5, \n                    $6, \n                    $7, \n                    $8, \n                    $9, \n                    $10, \n                    $11, \n                    $12, \n                    $13, \n                    $14, \n                    $15, \n                    $16, \n                    $17, \n                    $18, \n                    $19, \n                    $20, \n                    $21,\n                    $22\n                ) RETURNING *", [
                        _id, username, email, password, name_1, surname, new Date(birthDate).toISOString(),
                        totalAnime, totalAnimeWatching, totalAnimeCompleted, totalAnimeDropped, totalAnimePlanToWatch,
                        totalManga, totalMangaReading, totalMangaCompleted, totalMangaDropped, totalMangaPlanToRead,
                        totalAnimeLiked || [],
                        totalMangaLiked || [],
                        salt,
                        totalAnimeOnHold,
                        totalMangaOnHold
                    ])];
            case 3:
                result = _b.sent();
                handle_1.Console.log(result);
                if (result.rows.length !== 0) {
                    res.status(200).json({ success: true, message: 'Usuário registrado com sucesso' });
                }
                else {
                    throw "Erro ao criar a conta";
                }
                return [3 /*break*/, 5];
            case 4:
                handle_1.Console.log("GAY");
                throw handle_1.ErrorType.invalidReCaptcha;
            case 5: return [3 /*break*/, 7];
            case 6:
                err_4 = _b.sent();
                switch (err_4) {
                    case handle_1.ErrorType.noToken:
                        (0, handle_1.sendError)(res, handle_1.ErrorType.noToken);
                        break;
                    case handle_1.ErrorType.invalidToken:
                        (0, handle_1.sendError)(res, handle_1.ErrorType.invalidReCaptcha);
                        break;
                    case handle_1.ErrorType.invalidEmail:
                        (0, handle_1.sendError)(res, handle_1.ErrorType.invalidEmail);
                        break;
                    default:
                        (0, handle_1.sendError)(res, handle_1.ErrorType.default, 500, err_4);
                }
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
exports.default = userPostRouter;
