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
var sleep_promise_1 = require("sleep-promise");
var episodesGetRouter = e.Router();
//rota para pegar um episodio
episodesGetRouter.get('/ep/:animeId/:seasonId/:epId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, animeId, seasonId, epId, ep, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                if (!req.params.animeId || !req.params.seasonId || !req.params.epId) {
                    throw handle_1.ErrorType.undefined;
                }
                _a = req.params, animeId = _a.animeId, seasonId = _a.seasonId, epId = _a.epId;
                return [4 /*yield*/, req.db.query("SELECT * FROM episodes WHERE anime_id = $1 AND season_id = $2 AND id = $3", [animeId, seasonId, epId])];
            case 1:
                ep = _b.sent();
                res.send(ep.rows[0]);
                return [3 /*break*/, 3];
            case 2:
                err_1 = _b.sent();
                switch (err_1) {
                    case handle_1.ErrorType.undefined:
                        (0, handle_1.sendError)(res, handle_1.ErrorType.undefined, 400, "");
                        break;
                    default:
                        (0, handle_1.sendError)(res, handle_1.ErrorType.default, 500, err_1);
                }
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
//rota para pegar todos os eps de uma season
episodesGetRouter.get("/season/:animeid/:seasonid", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, animeid, seasonid, result, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.params, animeid = _a.animeid, seasonid = _a.seasonid;
                return [4 /*yield*/, req.db.query("SELECT * FROM anime.episodes WHERE season_id = $1 AND anime_id = $2;", [seasonid, animeid])];
            case 1:
                result = _b.sent();
                if (result.rows.length === 0) {
                    throw handle_1.ErrorType.NotId;
                }
                return [4 /*yield*/, (0, sleep_promise_1.default)(50)
                    // Console.log(result.rows)
                ];
            case 2:
                _b.sent();
                // Console.log(result.rows)
                res.send(result.rows);
                return [3 /*break*/, 4];
            case 3:
                err_2 = _b.sent();
                switch (err_2) {
                    case handle_1.ErrorType.NotId:
                        (0, handle_1.sendError)(res, handle_1.ErrorType.NotId);
                        break;
                    default:
                        (0, handle_1.sendError)(res, handle_1.ErrorType.default, 500, err_2);
                }
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
//Rota para pegar os episódios q lançaram na semana
episodesGetRouter.get('/lan', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var count, _a, _b, err_3;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                count = req.query.count;
                _b = (_a = res).send;
                return [4 /*yield*/, req.db.query("\n            SELECT \n                a.name AS animename,\n                s.name AS seasonname,\n                e.name,\n                e.id,\n                e.anime_id,\n                e.season_id,\n                e.duration,\n                e.resolution,\n                e.date_added\n            FROM \n                anime.episodes e\n            JOIN \n                anime.seasons s ON e.season_id = s.id\n            JOIN \n                anime.anime a ON s.anime_id = a.id \n            WHERE \n                e.date_added >= NOW() - INTERVAL '7 days'\n            ORDER BY \n                e.date_added DESC\n            LIMIT $1;\n        ", [count])];
            case 1:
                _b.apply(_a, [(_c.sent()).rows]);
                return [3 /*break*/, 3];
            case 2:
                err_3 = _c.sent();
                (0, handle_1.sendError)(res, handle_1.ErrorType.default, 500, err_3);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = episodesGetRouter;
