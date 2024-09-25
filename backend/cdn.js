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
var path = require("path");
var fs = require("fs");
var handle_1 = require("./assets/handle");
var consts_1 = require("./consts");
// @ts-ignore
var app = e();
// app.use((req:e.Request, res:e.Response, next:e.NextFunction) => {
//     res.header('Access-Control-Allow-Origin', '*'); // Ou o domínio específico
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     next();
// });
//
// app.get('/i/',(req: e.Request, res: e.Response) => {
//     try {
//         //colocar uma imagem teste aq depois
//         //pra testa a velocidade da internet
//         res.sendFile(path.join(__dirname, `./public/index.html`))
//     }catch(err){
//         sendError(res,ErrorType.default,500,err)
//     }
// })
app.get('/ani/img', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var typesImg, im, i, pathImg;
    return __generator(this, function (_a) {
        (0, handle_1.setHeader)(res);
        try {
            if (req.query.Id == null) {
                throw 1;
            }
            (0, handle_1.sendFile)().img(res);
            typesImg = ["jpe", "jpg", "jpeg", "png"];
            im = typesImg.length;
            for (i = 0; i < im; i++) {
                pathImg = path.join(consts_1.ANIME_PATH, req.query.Id, "img", "".concat(req.query.Id, ".").concat(typesImg[i]));
                if (fs.existsSync(pathImg)) {
                    return [2 /*return*/, res.sendFile(pathImg)];
                }
            }
        }
        catch (err) {
            if (err == 1) {
                (0, handle_1.sendError)(res, handle_1.ErrorType.undefined);
            }
            else if (err == 2) {
                (0, handle_1.sendError)(res, handle_1.ErrorType.NotId);
            }
        }
        return [2 /*return*/];
    });
}); });
app.get("/ep/:aniId/:season/:epId/:file", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, aniId, season, epId, file;
    return __generator(this, function (_b) {
        (0, handle_1.setHeader)(res);
        _a = req.params, aniId = _a.aniId, season = _a.season, epId = _a.epId, file = _a.file;
        if (file.split(".")[1] == "mp4") {
            res.status(206);
        }
        res.set('Cache-Control', 'public, max-age=7200');
        res.sendFile(path.join(consts_1.ANIME_PATH, aniId, "seasons", season, epId, file));
        return [2 /*return*/];
    });
}); });
app.get('/ep/:aniId/:seasonId/:epId/:lang', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, aniId, seasonId, epId, lang;
    return __generator(this, function (_b) {
        (0, handle_1.setHeader)(res);
        _a = req.params, aniId = _a.aniId, seasonId = _a.seasonId, epId = _a.epId, lang = _a.lang;
        res.set('Cache-Control', 'public, max-age=7200');
        res.sendFile(path.join(consts_1.ANIME_PATH, aniId, 'seasons', seasonId, epId, "".concat(epId, "-").concat(lang, ".vtt")));
        return [2 /*return*/];
    });
}); });
app.get("/epPoster/:aniId/:season/:epId", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, aniId, season, epId;
    return __generator(this, function (_b) {
        _a = req.params, aniId = _a.aniId, season = _a.season, epId = _a.epId;
        res.set('Cache-Control', 'public, max-age=7200');
        res.sendFile(path.join(consts_1.ANIME_PATH, aniId, "seasons", season, epId, "".concat(epId, ".jpg")));
        return [2 /*return*/];
    });
}); });
app.get("/stream/:aniId/:season/:epId/:reso", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, aniId, season, epId, reso, filePath;
    return __generator(this, function (_b) {
        try {
            _a = req.params, aniId = _a.aniId, season = _a.season, epId = _a.epId, reso = _a.reso;
            filePath = path.join(consts_1.ANIME_PATH, aniId, "seasons", season, epId, "".concat(epId, "-").concat(reso, ".mp4"));
            res.setHeader('Cache-Control', 'public, max-age=7200');
            res.sendFile(filePath);
            // res.download(path.join(ANIME_PATH,aniId,"seasons",seasonId,epId,`${epId}-${reso}.mp4`))
        }
        catch (err) {
            (0, handle_1.sendError)(res, handle_1.ErrorType.default, 500, err);
        }
        return [2 /*return*/];
    });
}); });
//rota pro download do ep
app.get('/download/:aniid/:seasonid/:epid/:reso', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, aniid, seasonid, epid, reso, filePath, stat, fileSize, readStream_1, uploadedBytes_1;
    return __generator(this, function (_b) {
        try {
            _a = req.params, aniid = _a.aniid, seasonid = _a.seasonid, epid = _a.epid, reso = _a.reso;
            filePath = path.join(consts_1.ANIME_PATH, aniid, 'seasons', seasonid, epid, "".concat(epid, "-").concat(reso, ".mp4"));
            handle_1.Console.log('File path:', filePath); // Adicione isso para verificar o caminho do arquivo
            stat = fs.statSync(filePath);
            fileSize = stat.size;
            readStream_1 = fs.createReadStream(filePath);
            res.setHeader('Content-Type', 'video/mp4');
            res.setHeader('Content-Length', fileSize);
            res.setHeader('Content-Disposition', "attachment; filename=".concat(epid, ".mp4"));
            uploadedBytes_1 = 0;
            readStream_1.on('data', function (chunk) {
                uploadedBytes_1 += chunk.length;
                var canWrite = res.write(chunk);
                // console.log('Can write:', canWrite); // Adicione isso para verificar o status de escrita
                if (!canWrite) {
                    readStream_1.pause();
                }
            });
            res.on('drain', function () {
                // console.log('Drain event'); // Adicione isso para verificar quando o buffer está vazio
                readStream_1.resume();
            });
            readStream_1.on('end', function () {
                handle_1.Console.log('End of stream');
                res.end();
            });
            readStream_1.on('error', function (err) {
                console.error('Stream error:', err);
                res.status(500).end();
            });
            // res.sendFile(filePath)
        }
        catch (err) {
            (0, handle_1.sendError)(res, handle_1.ErrorType.default, 500, err);
        }
        return [2 /*return*/];
    });
}); });
app.get("/", function (req, res) {
    res.redirect("https://animefoda.top");
});
app.listen(8080, '0.0.0.0', function () {
    handle_1.Console.log("http://0.0.0.0:8080");
});
