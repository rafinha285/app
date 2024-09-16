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
var express_1 = require("express");
var checkToken_1 = require("../token/checkToken");
var handle_1 = require("../assets/handle");
var episodeListPostRouter = (0, express_1.Router)();
episodeListPostRouter.post('/', checkToken_1.checkToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, anime_id, dropped_on, episode_id, season_id, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, anime_id = _a.anime_id, dropped_on = _a.dropped_on, episode_id = _a.episode_id, season_id = _a.season_id;
                // Console.log(req.body,req.user as JwtUser);
                // Console.log([
                //     (req.user as JwtUser)._id,  // user_id
                //     anime_id                    // anime_id
                // ])
                return [4 /*yield*/, req.db.query("\n            SELECT users.check_and_insert_user_anime_list($1, $2);\n        ", [
                        req.user._id,
                        anime_id // anime_id
                    ])];
            case 1:
                // Console.log(req.body,req.user as JwtUser);
                // Console.log([
                //     (req.user as JwtUser)._id,  // user_id
                //     anime_id                    // anime_id
                // ])
                _b.sent();
                return [4 /*yield*/, req.db.query("\n            INSERT INTO users.user_episode_list\n            (\n                episode_id,\n                dropped_on,\n                season_id,\n                anime_id,\n                user_id,\n                watched\n            )\n            VALUES\n                (\n                    $1,\n                    $2,\n                    $3,\n                    $4,\n                    $5,\n                    ($2 >= (SELECT ending::double precision FROM anime.episodes WHERE id = $1))\n                )\n            ON CONFLICT (user_id, episode_id)\n                DO UPDATE\n                SET dropped_on = $2,\n                    date = now(),\n                    watched = CASE\n                            WHEN users.user_episode_list.watched = true THEN users.user_episode_list.watched\n                            ELSE ($2 >= (SELECT ending::double precision FROM anime.episodes WHERE id = $1))\n                        END;\n        ", [
                        episode_id,
                        dropped_on,
                        season_id,
                        anime_id,
                        req.user._id,
                    ])];
            case 2:
                _b.sent();
                res.json({ success: true });
                return [3 /*break*/, 4];
            case 3:
                err_1 = _b.sent();
                (0, handle_1.sendError)(res, handle_1.ErrorType.default, 500, err_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.default = episodeListPostRouter;
