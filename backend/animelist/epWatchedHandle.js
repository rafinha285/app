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
exports.checkAnimeList = exports.editEpisode = exports.editSeason = exports.addSeason = exports.epWatchedHandle = void 0;
var Postgre_1 = require("../database/Postgre");
var animeFunctions_1 = require("../../src/functions/animeFunctions");
var handle_1 = require("../assets/handle");
function epWatchedHandle(req, res, anime, log) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, aniId, seasonId, epId, ep, epResult, result, e_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = req.params, aniId = _a.aniId, seasonId = _a.seasonId, epId = _a.epId;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 15, , 16]);
                    return [4 /*yield*/, req.db.execute("SELECT * FROM episodes WHERE id = ".concat(epId))];
                case 2:
                    ep = (_b.sent()).rows[0];
                    handle_1.Console.log(ep);
                    return [4 /*yield*/, Postgre_1.animeClient.query("\n            SELECT * FROM users.user_episode_list WHERE episode_id = $1\n        ", [epId])];
                case 3:
                    epResult = _b.sent();
                    if (!(epResult.rows.length == 0)) return [3 /*break*/, 5];
                    return [4 /*yield*/, Postgre_1.animeClient.query("\n                INSERT INTO users.user_episode_list (\n                    episode_id,\n                    dropped_on,\n                    season_id,\n                    anime_id,\n                    user_id,\n                    duration\n                ) VALUES (\n                    $1,\n                    $2,\n                    $3,\n                    $4,\n                    $5,\n                    $6\n                ) RETURNING *;\n            ", [
                            epId,
                            req.body.duration,
                            seasonId,
                            aniId,
                            req.user._id,
                            ep.duration
                        ])];
                case 4:
                    _b.sent();
                    return [3 /*break*/, 7];
                case 5: return [4 /*yield*/, editEpisode(req.user, aniId, ep, req.body.duration)];
                case 6:
                    _b.sent();
                    _b.label = 7;
                case 7: return [4 /*yield*/, log.query("\n            INSERT INTO public.log (\n                date,\n                anime,\n                duration,\n                ep,\n                season\n        ) VALUES(\n            $1,\n            $2,\n            $3,\n            $4,\n            $5\n        ) RETURNING TRUE\n        ", [
                        new Date(Date.now()),
                        aniId,
                        req.body.duration,
                        epId,
                        seasonId
                    ])];
                case 8:
                    _b.sent();
                    return [4 /*yield*/, Postgre_1.animeClient.query("\n            SELECT season_id\n                FROM users.user_season_list\n                WHERE season_id = $1 AND user_id = $2;\n        ", [seasonId, req.user._id])];
                case 9:
                    result = _b.sent();
                    if (!(result.rows.length < 1)) return [3 /*break*/, 11];
                    return [4 /*yield*/, addSeason(seasonId, req, ep, aniId)];
                case 10:
                    _b.sent();
                    return [3 /*break*/, 14];
                case 11:
                    if (!(result.rows.length > 1)) return [3 /*break*/, 12];
                    handle_1.Console.error("fudeo");
                    throw result.rows[0];
                case 12: return [4 /*yield*/, editSeason(seasonId, req, aniId, ep)];
                case 13:
                    _b.sent();
                    _b.label = 14;
                case 14: return [2 /*return*/, res.status(200).send("Log" + req.user._id)];
                case 15:
                    e_1 = _b.sent();
                    switch (e_1) {
                        case handle_1.ErrorType.default:
                            return [2 /*return*/, (0, handle_1.sendError)(res, handle_1.ErrorType.default, 500, e_1)];
                        case handle_1.ErrorType.undefined:
                            return [2 /*return*/, (0, handle_1.sendError)(res, handle_1.ErrorType.undefined)];
                        default:
                            return [2 /*return*/, (0, handle_1.sendError)(res, handle_1.ErrorType.default, 500, e_1)];
                    }
                    return [3 /*break*/, 16];
                case 16: return [2 /*return*/];
            }
        });
    });
}
exports.epWatchedHandle = epWatchedHandle;
function addSeason(seasonId, req, ep, aniId) {
    return __awaiter(this, void 0, void 0, function () {
        var seasons, _a, season, e_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    _a = animeFunctions_1.tupleToSeason;
                    return [4 /*yield*/, req.db.execute("SELECT seasons FROM anime WHERE id = ".concat(aniId))];
                case 1:
                    seasons = _a.apply(void 0, [(_b.sent()).rows[0].seasons]);
                    season = seasons.find(function (v) { return v.id == seasonId; });
                    handle_1.Console.log(season, aniId);
                    return [4 /*yield*/, Postgre_1.animeClient.query("\n                INSERT INTO users.user_season_list (\n                    anime_id, season_id, total_episodes, user_id, total_episodes_watched,  total_rewatched_episodes\n                ) VALUES($1,$2,$3,$4,$5,$6)\n                RETURNING TRUE;\n            ", [
                            aniId,
                            seasonId,
                            season.episodes.length,
                            req.user._id,
                            ep.epindex,
                            0
                        ])];
                case 2:
                    _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_2 = _b.sent();
                    handle_1.Console.error("Add Season: " + e_2);
                    throw e_2;
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.addSeason = addSeason;
function editSeason(seasonId, req, aniId, ep) {
    return __awaiter(this, void 0, void 0, function () {
        var seasons, _a, season, rewatched, e_3;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 6, , 7]);
                    _a = animeFunctions_1.tupleToSeason;
                    return [4 /*yield*/, req.db.execute("SELECT seasons FROM anime WHERE id = ".concat(aniId))];
                case 1:
                    seasons = _a.apply(void 0, [(_b.sent()).rows[0].seasons]);
                    season = seasons.find(function (v) { return v.id == seasonId; });
                    handle_1.Console.log(ep);
                    return [4 /*yield*/, Postgre_1.animeClient.query("\n            SELECT episode_id,\n                   dropped_on,\n                   season_id,\n                   anime_id,\n                   user_id,\n                   id,\n                   date,\n                   duration\n            FROM users.user_episode_list\n            WHERE user_id = $1\n              AND episode_id = $2\n              AND season_id = $3\n              AND anime_id = $4;\n        ", [req.user._id, ep.id.toString(), seasonId, aniId])];
                case 2:
                    rewatched = (_b.sent()).rows.length == 1;
                    if (!rewatched) return [3 /*break*/, 4];
                    return [4 /*yield*/, Postgre_1.animeClient.query("\n                UPDATE users.user_season_list\n                    SET total_rewatched_episodes=$1, \n                    total_episodes_watched=$2\n                    WHERE season_id=$3 AND user_id=$4;\n            ", [ep.epindex, season.episodes.length, seasonId, req.user._id])];
                case 3: return [2 /*return*/, _b.sent()];
                case 4: return [4 /*yield*/, Postgre_1.animeClient.query("\n            UPDATE users.user_season_list\n                SET total_episodes_watched=$1 \n                WHERE season_id=$2 AND user_id=$3;\n        ", [ep.epindex, seasonId, req.user._id])];
                case 5: return [2 /*return*/, _b.sent()];
                case 6:
                    e_3 = _b.sent();
                    handle_1.Console.error(e_3);
                    throw e_3;
                case 7: return [2 /*return*/];
            }
        });
    });
}
exports.editSeason = editSeason;
function editEpisode(user, aniId, ep, mud) {
    return __awaiter(this, void 0, void 0, function () {
        var e_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    if (!mud) {
                        throw handle_1.ErrorType.undefined;
                    }
                    return [4 /*yield*/, Postgre_1.animeClient.query("\n            UPDATE users.user_episode_list \n            SET dropped_on = $1,\n                date = now()\n            WHERE user_id = $2\n            AND episode_id = $3\n            AND anime_id = $4\n        ", [mud, user._id, ep.id.toString(), aniId])];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    e_4 = _a.sent();
                    handle_1.Console.error("Edit Episode: " + e_4);
                    throw e_4;
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.editEpisode = editEpisode;
function checkAnimeList(user, animeId) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Postgre_1.animeClient.query("\n        SELECT \n    ")];
                case 1:
                    result = (_a.sent());
                    return [2 /*return*/];
            }
        });
    });
}
exports.checkAnimeList = checkAnimeList;
