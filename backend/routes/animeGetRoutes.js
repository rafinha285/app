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
var animeGetRouter = e.Router();
//TODO fazer a database de animes ser o pgsql
//scylla nao tem muitas funções q seriam boas para bom funcionamento da database
//rota para lançamentos (usado para pegar todos os animes)
animeGetRouter.get("/lan", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var query, _a, _b, err_1;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                (0, handle_1.setHeader)(res);
                res.setHeader("Cache-Control", "public, max-age:60");
                query = "SELECT id, name, description, genre, averageeptime FROM anime.anime;";
                _b = (_a = res).send;
                return [4 /*yield*/, req.db.query(query)];
            case 1:
                _b.apply(_a, [(_c.sent()).rows]);
                return [3 /*break*/, 3];
            case 2:
                err_1 = _c.sent();
                handle_1.Console.error(err_1);
                (0, handle_1.sendError)(res, handle_1.ErrorType.undefined);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
//rota para a agenda de lançamentos
animeGetRouter.get("/agenda", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, err_2;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                _b = (_a = res).send;
                return [4 /*yield*/, req.db.query("SELECT id, name, description,rating, weekday FROM anime.anime WHERE state = 'Lançando'")];
            case 1:
                _b.apply(_a, [(_c.sent()).rows]);
                return [3 /*break*/, 3];
            case 2:
                err_2 = _c.sent();
                (0, handle_1.sendError)(res, handle_1.ErrorType.default, 500, err_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
//rota para pegar os produtores, criadores, studios
animeGetRouter.get('/prods/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var animeid, prod, cria, stud, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                animeid = req.params.id;
                return [4 /*yield*/, req.db.query("\n            WITH producer_ids AS (\n                SELECT UNNEST(producers) AS producer_id\n                FROM anime.anime\n                WHERE id = $1\n            )\n            SELECT p.id, p.name\n            FROM producer_ids pi\n            JOIN anime.producers p ON pi.producer_id = p.id;\n        ", [animeid])];
            case 1: return [4 /*yield*/, (_a.sent()).rows];
            case 2:
                prod = _a.sent();
                return [4 /*yield*/, req.db.query("\n            WITH producer_ids AS (\n                SELECT UNNEST(creators) AS producer_id\n                FROM anime.anime\n                WHERE id = $1\n            )\n            SELECT p.id, p.name\n            FROM producer_ids pi\n            JOIN anime.creators p ON pi.producer_id = p.id;\n        ", [animeid])];
            case 3: return [4 /*yield*/, (_a.sent()).rows];
            case 4:
                cria = _a.sent();
                return [4 /*yield*/, req.db.query("\n            WITH producer_ids AS (\n                SELECT UNNEST(studios) AS producer_id\n                FROM anime.anime\n                WHERE id = $1\n            )\n            SELECT p.id, p.name\n            FROM producer_ids pi\n            JOIN anime.studios p ON pi.producer_id = p.id;\n        ", [animeid])];
            case 5: return [4 /*yield*/, (_a.sent()).rows];
            case 6:
                stud = _a.sent();
                res.send({
                    producers: prod,
                    creators: cria,
                    studios: stud
                });
                return [3 /*break*/, 8];
            case 7:
                err_3 = _a.sent();
                (0, handle_1.sendError)(res, handle_1.ErrorType.default, 500, err_3);
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); });
//rota para pegar seasons de um anime
animeGetRouter.get("/seasons/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, err_4;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                _b = (_a = res).send;
                return [4 /*yield*/, req.db.query("SELECT * FROM anime.seasons WHERE anime_id = $1", [req.params.id])];
            case 1:
                _b.apply(_a, [(_c.sent()).rows]);
                return [3 /*break*/, 3];
            case 2:
                err_4 = _c.sent();
                (0, handle_1.sendError)(res, handle_1.ErrorType.default, 500, err_4);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
//rota apra pegar uma season de um anime
animeGetRouter.get('/season/:id/:seasonId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, err_5;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                _b = (_a = res).send;
                return [4 /*yield*/, req.db.query("SELECT * FROM anime.seasons WHERE anime_id = $1 AND id = $2", [req.params.id, req.params.seasonId])];
            case 1:
                _b.apply(_a, [(_c.sent()).rows]);
                return [3 /*break*/, 3];
            case 2:
                err_5 = _c.sent();
                (0, handle_1.sendError)(res, handle_1.ErrorType.default);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
//rota para pegar animes de acordo com o genero
animeGetRouter.get("/gen/:gen", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, err_6;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                _b = (_a = res).send;
                return [4 /*yield*/, req.db.query("SELECT id, name, description, rating FROM anime.anime WHERE EXISTS (\n            SELECT 1 \n            FROM unnest(genre) AS g \n            WHERE g LIKE $1\n        );", ["%".concat(req.params.gen, "%")])];
            case 1:
                _b.apply(_a, [(_c.sent()).rows]);
                return [3 /*break*/, 3];
            case 2:
                err_6 = _c.sent();
                (0, handle_1.sendError)(res, handle_1.ErrorType.default, 500, err_6);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
//rota para pegar animes de acordo com os produtores
animeGetRouter.get("/prod/:prod", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, err_7;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                _b = (_a = res).send;
                return [4 /*yield*/, req.db.query("SELECT id, name, description, rating \n        FROM anime.anime \n        WHERE $1::uuid = ANY(producers)", [req.params.prod])];
            case 1:
                _b.apply(_a, [(_c.sent()).rows]);
                return [3 /*break*/, 3];
            case 2:
                err_7 = _c.sent();
                (0, handle_1.sendError)(res, handle_1.ErrorType.default, 500, err_7);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
//rota para pegar animes de acordo com os criadores
animeGetRouter.get("/crea/:cria", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, err_8;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                _b = (_a = res).send;
                return [4 /*yield*/, req.db.query("SELECT id, name, description, rating \n            FROM anime.anime \n            WHERE $1::uuid = ANY(creators)", [req.params.cria])];
            case 1:
                _b.apply(_a, [(_c.sent()).rows]);
                return [3 /*break*/, 3];
            case 2:
                err_8 = _c.sent();
                (0, handle_1.sendError)(res, handle_1.ErrorType.default, 500, err_8);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
//rota para pegar animes de acordo com os produtores
animeGetRouter.get("/stud/:stud", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, err_9;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                _b = (_a = res).send;
                return [4 /*yield*/, req.db.query("SELECT id, name, description, rating \n            FROM anime.anime \n            WHERE $1::uuid = ANY(studios)", [req.params.stud])];
            case 1:
                _b.apply(_a, [(_c.sent()).rows]);
                return [3 /*break*/, 3];
            case 2:
                err_9 = _c.sent();
                (0, handle_1.sendError)(res, handle_1.ErrorType.default, 500, err_9);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
//rota para pesquisar anime pelo nome (FUNCIONANDO)
animeGetRouter.get("/search/:s", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var s, _a, _b, err_10;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                s = req.params.s;
                // Console.log(s)
                _b = (_a = res).send;
                return [4 /*yield*/, req.db.query("SELECT id, name, description, rating FROM anime.anime WHERE name ILIKE $1 OR name2 ILIKE $1", ["%".concat(s, "%")])];
            case 1:
                // Console.log(s)
                _b.apply(_a, [(_c.sent()).rows]);
                return [3 /*break*/, 3];
            case 2:
                err_10 = _c.sent();
                (0, handle_1.sendError)(res, handle_1.ErrorType.default, 500, err_10);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
//rota para pegar anime
//esse sempre em ultimo nas rotas
animeGetRouter.get("/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, err_11;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                _b = (_a = res).send;
                return [4 /*yield*/, req.db.query("SELECT id, averageeptime, date_added, description, genre, language, name, name2, quality, rating, weekday, state, releasedate\n\tFROM anime.anime WHERE id = $1;", [req.params.id])];
            case 1:
                _b.apply(_a, [(_c.sent()).rows[0]]);
                return [3 /*break*/, 3];
            case 2:
                err_11 = _c.sent();
                (0, handle_1.sendError)(res, handle_1.ErrorType.NotId);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = animeGetRouter;
