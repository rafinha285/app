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
exports.updateAnimelistNumbers = void 0;
var Postgre_1 = require("../../backend/database/Postgre");
var animelistRoutes_1 = require("../routes/animelistRoutes");
// export class UserAnimeList implements AnimeUser{
//     user_id: string;
//     id: number;
//     anime_id: string;
//     name: string;
//     start_date?: Date;
//     finish_date?: Date;
//     rate: number;
//     status: userAnimeState;
//     priority: priorityValue;
//     last_ep: EpisodeUser[];
//     constructor(
//         user_id:string,
//         id: number,
//         anime_id: string,
//         name: string,
//         rate: number,
//         status: userAnimeState,
//         priority: priorityValue,
//         last_ep: EpisodeUser[],
//         start_date?: Date,
//         finish_date?: Date
//     ) {
//         this.user_id = user_id;
//         this.id = id;
//         this.anime_id = anime_id;
//         this.name = name;
//         this.rate = rate;
//         this.status = status;
//         this.priority = priority;
//         this.last_ep = last_ep;
//         this.start_date = start_date;
//         this.finish_date = finish_date;
//     }
//     async save():Promise<void> {
//         let con = await pgClient.connect()
//         try{
//             await con.query(`INSERT INTO users.user_anime_list
//                 (
//                     user_id,
//                     anime_id,
//                     status,
//                     name,
//                     start_date,
//                     finish_date,
//                     rate,
//                     priority,
//                 ) VALUES (
//                     $1
//                     $2
//                     $3
//                     $4
//                     $5
//                     $6
//                     $7
//                     $8
//                 )
//             `,[
//                 this.user_id,
//                 this.anime_id,
//                 this.status,
//                 this.start_date,
//                 this.finish_date,
//                 this.rate,
//                 this.priority,
//             ])
//         }catch(err){
//             con.query("ROLLBACK")
//             throw err
//         }finally{
//             con.release()
//         }
//     }
// }
animelistRoutes_1.AnimelistEmitter.on('updateNumbers', function (e) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, updateAnimelistNumbers(e)];
        case 1: return [2 /*return*/, _a.sent()];
    }
}); }); });
// AnimelistEmitter.on('insert',async(e)=>await updateAnimelistNumbers(e))
function updateAnimelistNumbers(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var totalAnimeResult, watchingResult, completedResult, droppedResult, planToWatchResult, totalAnime, watching, completed, dropped, planToWatch, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 7, , 8]);
                    return [4 /*yield*/, Postgre_1.pgClient.query("\n            SELECT COUNT(*) as total \n            FROM users.user_anime_list \n            WHERE user_id = $1\n        ", [userId])];
                case 1:
                    totalAnimeResult = _a.sent();
                    return [4 /*yield*/, Postgre_1.pgClient.query("\n            SELECT COUNT(*) as watching \n            FROM users.user_anime_list \n            WHERE status = 'watching' AND user_id = $1\n        ", [userId])];
                case 2:
                    watchingResult = _a.sent();
                    return [4 /*yield*/, Postgre_1.pgClient.query("\n            SELECT COUNT(*) as completed \n            FROM users.user_anime_list \n            WHERE status = 'completed' AND user_id = $1\n        ", [userId])];
                case 3:
                    completedResult = _a.sent();
                    return [4 /*yield*/, Postgre_1.pgClient.query("\n            SELECT COUNT(*) as dropped \n            FROM users.user_anime_list \n            WHERE status = 'dropped' AND user_id = $1\n        ", [userId])];
                case 4:
                    droppedResult = _a.sent();
                    return [4 /*yield*/, Postgre_1.pgClient.query("\n            SELECT COUNT(*) as plantowatch \n            FROM users.user_anime_list \n            WHERE status = 'plan_to_watch' AND user_id = $1\n        ", [userId])];
                case 5:
                    planToWatchResult = _a.sent();
                    totalAnime = totalAnimeResult.rows[0].total;
                    watching = watchingResult.rows[0].watching;
                    completed = completedResult.rows[0].completed;
                    dropped = droppedResult.rows[0].dropped;
                    planToWatch = planToWatchResult.rows[0].plantowatch;
                    console.log([totalAnime, watching, completed, dropped, planToWatch, userId]);
                    return [4 /*yield*/, Postgre_1.pgClient.query("\n            UPDATE users.users\n            SET totalanime = $1, totalanimewatching = $2, totalanimecompleted = $3, totalanimedropped = $4, totalanimeplantowatch = $5\n            WHERE id = $6\n        ", [totalAnime, watching, completed, dropped, planToWatch, userId])];
                case 6:
                    _a.sent();
                    return [3 /*break*/, 8];
                case 7:
                    err_1 = _a.sent();
                    throw err_1;
                case 8: return [2 /*return*/];
            }
        });
    });
}
exports.updateAnimelistNumbers = updateAnimelistNumbers;
