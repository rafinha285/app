"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.AnimelistEmitter = void 0;
var express = require("express");
var Postgre_1 = require("../database/Postgre");
var handle_1 = require("../assets/handle");
var checkToken_1 = require("../token/checkToken");
var events_1 = require("events");
var animeListRouter = express.Router();
animeListRouter.post("/rating/:id", checkToken_1.checkToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, rating, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                rating = req.body.rating;
                // console.log(req.body,[parseInt(rating),(req.user as JwtUser)._id,id])
                return [4 /*yield*/, req.db.query("UPDATE users.user_anime_list\n            SET rate = $1\n            WHERE user_id = $2 AND anime_id = $3\n        ", [parseInt(rating), req.user._id, id])
                    // console.log(result)
                ];
            case 1:
                // console.log(req.body,[parseInt(rating),(req.user as JwtUser)._id,id])
                _a.sent();
                // console.log(result)
                res.json({ success: true, message: rating });
                return [3 /*break*/, 3];
            case 2:
                err_1 = _a.sent();
                (0, handle_1.sendError)(res, handle_1.ErrorType.default, 500, err_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// animeListRouter.get('/season/eps/:aniId/:seaId',checkToken,async(req:express.Request,res:express.Response)=>{
//     try{
//         const {aniid,seaId} = req.params;
//         await pgClient.query(`
//             SELECT * FROM users.user_episode_list
//             WHERE user_id =
//             `)
//         }catch(err){
//         }
//     })
var AnimelistEmitterClass = /** @class */ (function (_super) {
    __extends(AnimelistEmitterClass, _super);
    function AnimelistEmitterClass() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AnimelistEmitterClass.prototype.on = function (event, listener) {
        // Chamando o método 'on' da classe EventEmitter
        _super.prototype.on.call(this, event, listener);
        return this;
    };
    // Emitindo o evento 'updateNumbers' com argumento
    AnimelistEmitterClass.prototype.emitUpdateNumbers = function (userId, err) {
        this.emit('updateNumbers', err);
    };
    return AnimelistEmitterClass;
}(events_1.EventEmitter));
//!Rota para deletar anime da lista
//não era pra ta aq ma n tenho outro lugar pra bota
exports.AnimelistEmitter = new AnimelistEmitterClass();
animeListRouter.delete("/delete/:id", checkToken_1.checkToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, req.db.query("\n            DELETE FROM users.user_anime_list WHERE user_id = $1 AND anime_id = $2;\n        ", [req.user._id, req.params.id])];
            case 1:
                _a.sent();
                exports.AnimelistEmitter.emitUpdateNumbers(req.user._id, null);
                res.json({ success: true, message: "Anime deletado da lista do ".concat(req.user.username) });
                return [3 /*break*/, 3];
            case 2:
                err_2 = _a.sent();
                (0, handle_1.sendError)(res, handle_1.ErrorType.default, 500, err_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
animeListRouter.patch("/update", checkToken_1.checkToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, anime_id, finish_date, priority, start_date, status_1, result, err_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, anime_id = _a.anime_id, finish_date = _a.finish_date, priority = _a.priority, start_date = _a.start_date, status_1 = _a.status;
                handle_1.Console.log(anime_id, finish_date, priority, start_date, status_1);
                return [4 /*yield*/, req.db.query("\n            UPDATE users.user_anime_list\n            SET\n                status=$3,\n                start_date=$4,\n                finish_date=$5,\n                priority=$6\n            WHERE anime_id = $1 AND user_id = $2;\n        ", [anime_id, req.user._id, status_1, start_date, finish_date === null && status_1 === 'completed' ? new Date() : finish_date, priority])];
            case 1:
                result = _b.sent();
                handle_1.Console.log(result);
                res.json({ success: true, message: "Atualizado com sucesso" });
                return [3 /*break*/, 3];
            case 2:
                err_3 = _b.sent();
                (0, handle_1.sendError)(res, handle_1.ErrorType.default, 500, err_3);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
animeListRouter.get('/checklist/:id', checkToken_1.checkToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, result, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                user = req.user;
                return [4 /*yield*/, req.db.query("SELECT COUNT(*)\n            FROM users.user_anime_list\n            WHERE user_id = $1\n            AND anime_id = $2", [user._id, req.params.id])];
            case 1:
                result = _a.sent();
                // Console.log(result)
                res.json({ success: parseInt(result.rows[0].count) !== 0 });
                return [3 /*break*/, 3];
            case 2:
                err_4 = _a.sent();
                (0, handle_1.sendError)(res, handle_1.ErrorType.default, 500, err_4);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
animeListRouter.post('/insert/:id', checkToken_1.checkToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, ani, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                user = req.user;
                return [4 /*yield*/, req.db.query("SELECT * FROM anime.anime WHERE id = $1", [req.params.id])];
            case 1:
                ani = (_a.sent()).rows[0];
                return [4 /*yield*/, Postgre_1.pgClient.query("\n            INSERT INTO users.user_anime_list(\n                user_id, anime_id, status, name, start_date, priority)\n                VALUES ($1, $2, $3, $4, $5, $6);\n        ", [user._id, req.params.id, 'watching', ani.name, new Date(), "LOW"])];
            case 2:
                _a.sent();
                // console.log('updateNumbers',user)
                exports.AnimelistEmitter.emitUpdateNumbers(req.user._id, null);
                res.json({ success: true, message: "Anime adicionado a lista ".concat(user._id) });
                return [3 /*break*/, 4];
            case 3:
                err_5 = _a.sent();
                (0, handle_1.sendError)(res, handle_1.ErrorType.default, 500, err_5);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
animeListRouter.get("/:id", checkToken_1.checkToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, _b, err_6;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 2, , 3]);
                id = req.params.id;
                _b = (_a = res).json;
                _c = { success: true };
                return [4 /*yield*/, req.db.query("SELECT * FROM users.user_anime_list WHERE user_id = $1 AND anime_id = $2", [req.user._id, id])];
            case 1:
                _b.apply(_a, [(_c.response = (_d.sent()).rows[0], _c)]);
                return [3 /*break*/, 3];
            case 2:
                err_6 = _d.sent();
                (0, handle_1.sendError)(res, handle_1.ErrorType.default, 500, err_6);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
animeListRouter.get('/', checkToken_1.checkToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var response, err_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Postgre_1.pgClient.query("\n            SELECT user_id, anime_id, status, name, start_date, finish_date, rate, priority, id\n            FROM users.user_anime_list WHERE user_id = $1;\n            ", [req.user._id])];
            case 1:
                response = _a.sent();
                res.send(response.rows);
                return [3 /*break*/, 3];
            case 2:
                err_7 = _a.sent();
                (0, handle_1.sendError)(res, handle_1.ErrorType.default, 500, err_7);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = animeListRouter;
