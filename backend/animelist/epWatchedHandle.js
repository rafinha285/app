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
exports.getAllEpsList = exports.insertEpList = exports.insertAnimeList = exports.checkEpList = exports.checkAnimeList = exports.epWatchedHandle = void 0;
var animeModel_1 = require("../../src/types/animeModel");
var animeFunctions_1 = require("../../src/functions/animeFunctions");
var handle_1 = require("../assets/handle");
var pg = require("pg");
//TODO fazer ele checar se o anime ja existe no animeList
//se nao existir adicionar
//se tiver update
//^feito
//TODO fazer ele checar se ja existe o ep no episode list
//se nao existir adicionar
//se tiver update
//TODO fazer ele adicionar ao log o ep
//TODO deletar o last_ep da anime list
function epWatchedHandle(req, res, animeC, log, user) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, aniId, seasonId, epId, _b, droppedOn, duration, ep_index, watched, anime, epName, season, animeCheck, epCheck, e_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = req.params, aniId = _a.aniId, seasonId = _a.seasonId, epId = _a.epId;
                    _b = req.body, droppedOn = _b.droppedOn, duration = _b.duration, ep_index = _b.ep_index, watched = _b.watched;
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 17, , 18]);
                    if (!aniId || !seasonId || !epId) {
                        throw handle_1.ErrorType.undefined;
                    }
                    if (!user) {
                        throw handle_1.ErrorType.unauthorized;
                    }
                    return [4 /*yield*/, req.db.execute("SELECT name, id, seasons FROM anime WHERE id = ?", [aniId])];
                case 2:
                    anime = (_c.sent()).rows[0];
                    return [4 /*yield*/, req.db.execute("SELECT name FROM episodes WHERE id = ?", [epId])];
                case 3:
                    epName = (_c.sent()).rows[0];
                    season = (0, animeFunctions_1.tupleToSeason)(anime.seasons).find(function (v) { return v.id === seasonId; });
                    console.log(anime);
                    //Checa se o anime existe na lista do individuo hehe
                    handle_1.Console.log(user);
                    return [4 /*yield*/, checkAnimeList(user, aniId, animeC)];
                case 4:
                    animeCheck = _c.sent();
                    handle_1.Console.log(animeCheck);
                    if (!animeCheck) return [3 /*break*/, 6];
                    //Atualiza o estado do anime para assistindo
                    return [4 /*yield*/, animeC.query("\n                UPDATE users.user_anime_list\n                    SET status='watching'\n                    WHERE user_id = $1 AND anime_id = $2;\n            ", [user._id, aniId])];
                case 5:
                    //Atualiza o estado do anime para assistindo
                    _c.sent();
                    return [3 /*break*/, 8];
                case 6:
                    handle_1.Console.log("inseri");
                    //Coloca na lista o anime do episodio q foi assistido
                    return [4 /*yield*/, insertAnimeList(animeC, anime, user, animeModel_1.animeListStatus.watching)];
                case 7:
                    //Coloca na lista o anime do episodio q foi assistido
                    _c.sent();
                    _c.label = 8;
                case 8: return [4 /*yield*/, checkEpList(user, aniId, epId, animeC)];
                case 9:
                    epCheck = _c.sent();
                    handle_1.Console.log(epCheck);
                    if (!epCheck) return [3 /*break*/, 14];
                    if (!watched) return [3 /*break*/, 11];
                    return [4 /*yield*/, animeC.query("\n                    UPDATE users.user_episode_list\n                        SET dropped_on = $1,\n                        date = now(),\n                        watched = TRUE\n                    WHERE user_id = $2 AND anime_id = $3 AND episode_id = $4;\n                ", [duration, user._id, aniId, epId])];
                case 10:
                    _c.sent();
                    return [3 /*break*/, 13];
                case 11: return [4 /*yield*/, animeC.query("\n                    UPDATE users.user_episode_list\n                        SET dropped_on = $1,\n                            date = now(),\n                            watched = FALSE\n                        WHERE user_id = $2 AND anime_id = $3 AND episode_id = $4;\n                ", [droppedOn, user._id, aniId, epId])];
                case 12:
                    _c.sent();
                    _c.label = 13;
                case 13: return [3 /*break*/, 16];
                case 14: return [4 /*yield*/, insertEpList(animeC, aniId, seasonId, epId, droppedOn, ep_index, duration, user, watched, ep)];
                case 15:
                    _c.sent();
                    _c.label = 16;
                case 16:
                    // await log.query(`
                    //     INSERT INTO log (date, anime, page, duration, ep, season)
                    //     VALUES (
                    //         now(),
                    //         $1,
                    //         'watch',
                    //         $2,
                    //         $3,
                    //         $4
                    //       );
                    // `,[aniId,duration,epId,seasonId])
                    res.send({ success: true, message: "Log adicionado para user" + user.username });
                    return [3 /*break*/, 18];
                case 17:
                    e_1 = _c.sent();
                    switch (e_1) {
                        case handle_1.ErrorType.default:
                            return [2 /*return*/, (0, handle_1.sendError)(res, handle_1.ErrorType.default, 500, e_1)];
                        case handle_1.ErrorType.undefined:
                            return [2 /*return*/, (0, handle_1.sendError)(res, handle_1.ErrorType.undefined)];
                        case handle_1.ErrorType.unauthorized:
                            return [2 /*return*/, (0, handle_1.sendError)(res, handle_1.ErrorType.unauthorized)];
                        default:
                            return [2 /*return*/, (0, handle_1.sendError)(res, handle_1.ErrorType.default, 500, e_1)];
                    }
                    return [3 /*break*/, 18];
                case 18: return [2 /*return*/];
            }
        });
    });
}
exports.epWatchedHandle = epWatchedHandle;
//TODO update da season com o epIndex
//^salvar o episodio para a season pelo epindex e nao pelo id
//Checa se o anime esta na lista
function checkAnimeList(user, animeId, animeC) {
    return __awaiter(this, void 0, void 0, function () {
        var checkAnime;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, animeC.query("\n        SELECT name FROM users.user_anime_list WHERE anime_id = $1 AND user_id = $2;\n    ", [animeId, user._id])];
                case 1:
                    checkAnime = _a.sent();
                    return [2 /*return*/, (checkAnime.rowCount) > 0];
            }
        });
    });
}
exports.checkAnimeList = checkAnimeList;
//Checa se o ep esta na lista
function checkEpList(user, animeId, epId, animeC) {
    return __awaiter(this, void 0, void 0, function () {
        var checkEp;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, animeC.query("\n        SELECT ep_index FROM users.user_episode_list WHERE anime_id = $1 AND user_id=$2 AND episode_id=$3;\n    ", [animeId, user._id, epId])];
                case 1:
                    checkEp = _a.sent();
                    return [2 /*return*/, (checkEp.rowCount) > 0];
            }
        });
    });
}
exports.checkEpList = checkEpList;
//Coloca anime na lista de anime
function insertAnimeList(animeC, anime, user, status) {
    return __awaiter(this, void 0, void 0, function () {
        var err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    handle_1.Console.log(anime.id.toString(), user);
                    pg.Query;
                    return [4 /*yield*/, animeC.query("\n            insert into users.user_anime_list (user_id, anime_id, status, name, start_date)\n            values ($1,$2,$3,$4,now());\n        ", [user._id, anime.id.toString(), 'watching', anime.name])];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    throw err_1;
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.insertAnimeList = insertAnimeList;
//Coloca o ep na lista
function insertEpList(animeC, animeId, seasonId, epId, droppedOn, epIndex, duration, user, watched, epName, seasonName) {
    return __awaiter(this, void 0, void 0, function () {
        var err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, animeC.query("\n            INSERT INTO \n                users.user_episode_list \n                (\n                    episode_id,\n                    dropped_on,\n                    season_id,\n                    anime_id,\n                    user_id,\n                    date,\n                    duration,\n                    ep_index,\n                    watched,\n                    name,\n                    season_name\n                )\n            VALUES\n                ($1,$2,$3,$4,$5,now(),$6,$7,$8,$9,$10)\n        ", [
                            epId,
                            droppedOn,
                            seasonId,
                            animeId,
                            user._id,
                            duration,
                            epIndex,
                            watched,
                            epName,
                            seasonName
                        ])
                        // return true
                    ];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_2 = _a.sent();
                    throw err_2;
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.insertEpList = insertEpList;
function getAllEpsList(animeId, seasonId, user, animeC) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, animeC.query("\n        SELECT * FROM users.user_episode_list\n            WHERE user_id = $1 AND anime_id = $2 AND season_id = $3\n    ", [user._id, animeId, seasonId])];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.getAllEpsList = getAllEpsList;
