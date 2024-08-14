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
var handle_1 = require("./assets/handle");
var pool_1 = require("./database/pool");
var Postgre_1 = require("./database/Postgre");
var animeFunctions_1 = require("../src/functions/animeFunctions");
var con = Postgre_1.pgClient.connect();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var scyllaAnimes, i, _a, id, averageeptime, creators, date_added, description, genre, language, name_1, name2, producers, quality, rating, releasedate, seasons, state, studios, visible, weekday, anime, producersP, creatorsP, studiosP, j, cria, j, cria, j, stud, seasonsT, j, scyllaEpisodes, i, _b, id, animeid, audiotracks, date_added, duration, ending, epindex, name_2, openingend, openingstart, releasedate, resolution, seasonid, subtitlestracks, views;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, pool_1.client.connect()];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, pool_1.client.execute("SELECT * FROM anime ALLOW FILTERING")];
                case 2:
                    scyllaAnimes = _c.sent();
                    i = 0;
                    _c.label = 3;
                case 3:
                    if (!(i < scyllaAnimes.rows.length)) return [3 /*break*/, 21];
                    _a = scyllaAnimes.rows[i], id = _a.id, averageeptime = _a.averageeptime, creators = _a.creators, date_added = _a.date_added, description = _a.description, genre = _a.genre, language = _a.language, name_1 = _a.name, name2 = _a.name2, producers = _a.producers, quality = _a.quality, rating = _a.rating, releasedate = _a.releasedate, seasons = _a.seasons, state = _a.state, studios = _a.studios, visible = _a.visible, weekday = _a.weekday;
                    anime = {
                        id: id.toString(),
                        name: name_1,
                        name2: name2,
                        averageeptime: averageeptime,
                        creators: creators,
                        date_added: date_added,
                        description: description,
                        genre: genre,
                        language: language,
                        producers: producers,
                        quality: quality,
                        rating: rating,
                        releasedate: releasedate,
                        seasons: seasons,
                        state: state,
                        studios: studios,
                        visible: visible,
                        weekday: weekday
                    };
                    producersP = [];
                    creatorsP = [];
                    studiosP = [];
                    j = 0;
                    _c.label = 4;
                case 4:
                    if (!(j < anime.producers.length)) return [3 /*break*/, 7];
                    cria = tupleToProducer(anime.producers[j]);
                    // console.log(anime.producers[j])
                    // console.log("prod")
                    // console.log(cria)
                    return [4 /*yield*/, insertProds(cria, 'producers')];
                case 5:
                    // console.log(anime.producers[j])
                    // console.log("prod")
                    // console.log(cria)
                    _c.sent();
                    producersP.push(cria);
                    _c.label = 6;
                case 6:
                    j++;
                    return [3 /*break*/, 4];
                case 7:
                    j = 0;
                    _c.label = 8;
                case 8:
                    if (!(j < anime.creators.length)) return [3 /*break*/, 11];
                    cria = tupleToProducer(anime.creators[j]);
                    console.log(anime.creators[j]);
                    console.log("cria");
                    console.log(cria);
                    return [4 /*yield*/, insertProds(cria, 'creators')];
                case 9:
                    _c.sent();
                    creatorsP.push(cria);
                    _c.label = 10;
                case 10:
                    j++;
                    return [3 /*break*/, 8];
                case 11:
                    j = 0;
                    _c.label = 12;
                case 12:
                    if (!(j < anime.studios.length)) return [3 /*break*/, 15];
                    stud = tupleToProducer(anime.studios[j]);
                    console.log(anime.studios[j]);
                    console.log("stud");
                    console.log(stud);
                    return [4 /*yield*/, insertProds(stud, 'studios')];
                case 13:
                    _c.sent();
                    studiosP.push(stud);
                    _c.label = 14;
                case 14:
                    j++;
                    return [3 /*break*/, 12];
                case 15:
                    anime.producers = producersP;
                    anime.creators = creatorsP;
                    anime.studios = studiosP;
                    return [4 /*yield*/, insertAnime(anime)];
                case 16:
                    _c.sent();
                    seasonsT = (0, animeFunctions_1.tupleToSeason)(anime.seasons);
                    console.log(seasonsT);
                    j = 0;
                    _c.label = 17;
                case 17:
                    if (!(j < seasonsT.length)) return [3 /*break*/, 20];
                    console.log(seasonsT[j]);
                    return [4 /*yield*/, insertSeasons(seasonsT[j], anime.id)];
                case 18:
                    _c.sent();
                    _c.label = 19;
                case 19:
                    j++;
                    return [3 /*break*/, 17];
                case 20:
                    i++;
                    return [3 /*break*/, 3];
                case 21: return [4 /*yield*/, pool_1.client.execute("SELECT * FROM episodes")];
                case 22:
                    scyllaEpisodes = _c.sent();
                    console.log(scyllaEpisodes.rows[0]);
                    i = 0;
                    _c.label = 23;
                case 23:
                    if (!(i < scyllaEpisodes.rows.length)) return [3 /*break*/, 28];
                    _b = scyllaEpisodes.rows[i], id = _b.id, animeid = _b.animeid, audiotracks = _b.audiotracks, date_added = _b.date_added, duration = _b.duration, ending = _b.ending, epindex = _b.epindex, name_2 = _b.name, openingend = _b.openingend, openingstart = _b.openingstart, releasedate = _b.releasedate, resolution = _b.resolution, seasonid = _b.seasonid, subtitlestracks = _b.subtitlestracks, views = _b.views;
                    return [4 /*yield*/, con];
                case 24: return [4 /*yield*/, (_c.sent()).query("SELECT name FROM anime.episodes WHERE id = $1 AND anime_id = $2 AND season_id = $3", [id.toString(), animeid.toString(), seasonid.toString()])];
                case 25:
                    if (!((_c.sent()).rows.length === 0)) return [3 /*break*/, 27];
                    return [4 /*yield*/, con];
                case 26:
                    (_c.sent()).query("INSERT INTO anime.episodes (\n                id,\n                anime_id,\n                audiotracks,\n                date_added,\n                duration,\n                ending,\n                epindex,\n                name,\n                openingend,\n                openingstart,\n                releasedate,\n                resolution,\n                season_id,\n                subtitlestracks,\n                views\n            ) VALUES (\n                $1,\n                $2,\n                $3,\n                $4,\n                $5,\n                $6,\n                $7,\n                $8,\n                $9,\n                $10,\n                $11,\n                $12,\n                $13,\n                $14,\n                $15\n            )", [
                        id.toString(),
                        animeid.toString(),
                        audiotracks,
                        date_added,
                        duration,
                        ending,
                        epindex,
                        name_2,
                        openingend,
                        openingstart,
                        releasedate,
                        resolution,
                        seasonid.toString(),
                        subtitlestracks,
                        views
                    ]);
                    _c.label = 27;
                case 27:
                    i++;
                    return [3 /*break*/, 23];
                case 28: return [2 /*return*/];
            }
        });
    });
}
function tupleToProducer(prod) {
    // console.log(prod)
    return { id: prod.elements[0], name: prod.elements[1] };
}
function insertProds(prod, type) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, con];
                case 1: return [4 /*yield*/, (_a.sent()).query("SELECT id FROM anime.".concat(type, " WHERE id = $1"), [prod.id.toString()])];
                case 2:
                    if (!!((_a.sent()).rows.length > 0)) return [3 /*break*/, 5];
                    console.log("Inserting new entry");
                    return [4 /*yield*/, con];
                case 3: return [4 /*yield*/, (_a.sent()).query("INSERT INTO anime.".concat(type, " (id, name) VALUES ($1,$2)"), [prod.id.toString(), prod.name])];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 5:
                    console.log("cu nao");
                    _a.label = 6;
                case 6: return [2 /*return*/];
            }
        });
    });
}
function insertSeasons(season, animeId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, con];
                case 1: return [4 /*yield*/, (_a.sent()).query("SELECT id FROM anime.seasons WHERE id = $1 AND anime_id = $2", [season.id.toString(), animeId])];
                case 2:
                    if (!((_a.sent()).rows.length === 0)) return [3 /*break*/, 5];
                    return [4 /*yield*/, con];
                case 3: return [4 /*yield*/, (_a.sent()).query("INSERT INTO anime.seasons (id,anime_id,name,episodes,index) VALUES ($1,$2,$3,$4,$5)", [season.id.toString(), animeId, season.name, season.episodes, season.index])];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5: return [2 /*return*/];
            }
        });
    });
}
function insertAnime(_a) {
    var id = _a.id, averageeptime = _a.averageeptime, date_added = _a.date_added, description = _a.description, genre = _a.genre, language = _a.language, name = _a.name, name2 = _a.name2, producers = _a.producers, studios = _a.studios, creators = _a.creators, quality = _a.quality, rating = _a.rating, visible = _a.visible, weekday = _a.weekday;
    return __awaiter(this, void 0, void 0, function () {
        var producerIds, creatorIds, studioIds;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    handle_1.Console.log("insert anime");
                    return [4 /*yield*/, con];
                case 1: return [4 /*yield*/, (_b.sent()).query("SELECT id FROM anime.anime WHERE id = $1", [id])];
                case 2:
                    if (!!((_b.sent()).rows.length > 0)) return [3 /*break*/, 5];
                    return [4 /*yield*/, con];
                case 3: return [4 /*yield*/, (_b.sent()).query("\n                INSERT INTO anime.anime (\n                    id,\n                    averageeptime,\n                    date_added,\n                    description,\n                    genre,\n                    language,\n                    name,\n                    name2,\n                    quality,\n                    rating,\n                    visible,\n                    weekday\n                ) VALUES (\n                    $1,\n                    $2,\n                    $3,\n                    $4,\n                    $5,\n                    $6,\n                    $7,\n                    $8,\n                    $9,\n                    $10,\n                    $11,\n                    $12\n                )\n            ", [
                        id,
                        averageeptime,
                        date_added,
                        description,
                        genre,
                        language,
                        name,
                        name2,
                        quality,
                        rating,
                        true,
                        weekday
                    ])];
                case 4:
                    _b.sent();
                    return [3 /*break*/, 6];
                case 5:
                    handle_1.Console.log("cuzao");
                    _b.label = 6;
                case 6:
                    producerIds = producers.map(function (v) { return v.id.toString(); });
                    creatorIds = creators.map(function (v) { return v.id.toString(); });
                    studioIds = studios.map(function (v) { return v.id.toString(); });
                    return [4 /*yield*/, con];
                case 7: 
                // Atualizar produtores
                return [4 /*yield*/, (_b.sent()).query("\n            UPDATE anime.anime \n            SET producers = $1 \n            WHERE id = $2\n        ", [
                        producerIds,
                        id // ID do anime
                    ])];
                case 8:
                    // Atualizar produtores
                    _b.sent();
                    return [4 /*yield*/, con];
                case 9: 
                // Atualizar criadores
                return [4 /*yield*/, (_b.sent()).query("\n            UPDATE anime.anime \n            SET creators = $1 \n            WHERE id = $2\n        ", [
                        creatorIds,
                        id // ID do anime
                    ])];
                case 10:
                    // Atualizar criadores
                    _b.sent();
                    return [4 /*yield*/, con];
                case 11: 
                // Atualizar estúdios
                return [4 /*yield*/, (_b.sent()).query("\n            UPDATE anime.anime \n            SET studios = $1 \n            WHERE id = $2\n        ", [
                        studioIds,
                        id // ID do anime
                    ])];
                case 12:
                    // Atualizar estúdios
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
main();
