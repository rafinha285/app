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
exports.checkIsLogged = exports.DateToStringLocal = exports.DateToStringInput = exports.prevEpUrl = exports.nextEpUrl = exports.handleNextEp = exports.handleEpWatching = exports.getMonthName = exports.trim = exports.getEpTime = void 0;
var episodeModel_1 = require("../types/episodeModel");
function getEpTime(ee) {
    var e = Math.round(ee);
    var h = Math.floor(e / 3600).toString();
    var m = "";
    var s = (e % 60).toString();
    var ar = [];
    if (h === "0") {
        s = s.length === 1 ? (s = "0".concat(s)) : s;
        m = Math.floor((e % 3600) / 60).toString();
        m = m.length === 1 ? "0".concat(m) : m; // Correção aqui
        ar.push(m, s);
    }
    else {
        s = s.length === 1 ? (s = "0".concat(s)) : s;
        m = Math.floor((e % 3600) / 60).toString();
        m = m.length === 1 ? "0".concat(m) : m; // Correção aqui
        h = h.length === 1 ? (h = "0".concat(h)) : h;
        ar.push(h, m, s);
    }
    return ar.join(":");
}
exports.getEpTime = getEpTime;
function trim(string, maxLength) {
    if (maxLength === void 0) { maxLength = 120; }
    var t = string.substring(0, maxLength - 3);
    console.log(t);
    t = t.substring(0, Math.min(t.length, t.lastIndexOf(" "))) + "...";
    return t;
}
exports.trim = trim;
var monthNames = {
    'pt-br': [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ],
};
var getMonthName = function (date, short, locale) {
    if (locale === void 0) { locale = "pt-br"; }
    var month = date.getMonth();
    var localeMonthNames = monthNames[locale];
    if (!localeMonthNames) {
        return '';
    }
    return short ? localeMonthNames[month].substring(0, 3) : localeMonthNames[month];
};
exports.getMonthName = getMonthName;
// export function NextEp(ani:AnimeDocument,seasonId:string,ep:Episode){
//     var eps = ani.seasons?.find(s=>s._id === seasonId)?.episodes!
//     let indiceAtual=eps?.findIndex(e=>e._id === ep._id)
//     let proximoEp = eps[indiceAtual!+1]
//     return proximoEp
// }
//var proximoEp = NextEp(ani,seasonId,ep)
//window.location.href = `/Anime/${ani.id}/watch/${seasonId}/${proximoEp.id}`
function handleEpWatching(ani, seasonId, ep, droppedOn, watched) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log(ep.id, watched, droppedOn);
                    return [4 /*yield*/, fetch("/api/log/watch/".concat(ani, "/").concat(seasonId, "/").concat(ep.id), {
                            method: "POST",
                            body: JSON.stringify({
                                duration: ep.duration,
                                watched: watched,
                                droppedOn: droppedOn,
                                ep_index: ep.epindex,
                            }),
                            headers: {
                                "Accept": "application/json, text/plain, */*",
                                "Content-Type": "application/json"
                            }
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.handleEpWatching = handleEpWatching;
var handleNextEp = function (ani, seasonId, eps, index, isLogged, time, interval) {
    if (isLogged) {
        handleEpWatching(ani, seasonId, eps.sort(function (a, b) { return a.epindex - b.epindex; })[index], time, true);
    }
    console.log(eps);
    var p = eps.find(function (v) { return v.epindex === (index + 1); });
    console.log(p);
    console.log(ani, seasonId, eps, index);
    if (p) {
        window.location.href = "/Anime/".concat(ani, "/watch/").concat(seasonId, "/").concat(p.id);
    }
};
exports.handleNextEp = handleNextEp;
function nextEpUrl(eps, ani, ep) {
    var posEp = eps.find(function (v) { return v.epindex === (ep.epindex + 1); });
    if (posEp) {
        console.log(ani, ep.seasonid, posEp, posEp.id, "/Anime/".concat(ani, "/watch/").concat(ep.seasonid, "/").concat(posEp.id));
        return "/Anime/".concat(ani, "/watch/").concat(ep.seasonid, "/").concat(posEp.id);
    }
    else {
        return undefined;
    }
}
exports.nextEpUrl = nextEpUrl;
function prevEpUrl(eps, ani, ep) {
    var prevEp = eps.find(function (v) { return v.epindex === (ep.epindex - 1); });
    if (prevEp) {
        console.log(ani, ep.seasonid, prevEp, prevEp.id, "/Anime/".concat(ani, "/watch/").concat(ep.seasonid, "/").concat(prevEp.id));
        return "/Anime/".concat(ani, "/watch/").concat(ep.seasonid, "/").concat(prevEp.id);
    }
    else {
        return undefined;
    }
}
exports.prevEpUrl = prevEpUrl;
function DateToStringInput(dat) {
    var date = new Date(dat);
    return date.toISOString().split("T")[0];
}
exports.DateToStringInput = DateToStringInput;
function DateToStringLocal(dat) {
    var date = new Date(dat);
    var day = String(date.getDate()).padStart(2, '0');
    var month = String(date.getMonth() + 1).padStart(2, '0'); // O mês é baseado em zero
    var year = date.getFullYear();
    console.log("".concat(day, "/").concat(month, "/").concat(year));
    // Retorna a data formatada como uma string
    return "".concat(day, "/").concat(month, "/").concat(year);
}
exports.DateToStringLocal = DateToStringLocal;
function checkIsLogged(isLogged) {
    if (!isLogged) {
        alert("Nenhuma conta conectada");
        window.location.href = '/login/';
    }
}
exports.checkIsLogged = checkIsLogged;
Date.prototype.getDayOfWeekName = function () {
    // const daysOfWeek = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    var daysOfWeek = Date.prototype.daysOfWeek();
    var dayOfWeek = this.getDay(); // Retorna um número de 0 (Domingo) a 6 (Sábado)
    return daysOfWeek[dayOfWeek];
};
Date.prototype.daysOfWeek = function (language) {
    if (language === void 0) { language = episodeModel_1.languages.Portuguese; }
    switch (language) {
        case episodeModel_1.languages.Portuguese:
            return ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
        case episodeModel_1.languages.English:
            return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        case episodeModel_1.languages.Spanish:
            return ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']; // Dias da semana em espanhol
        case episodeModel_1.languages.Japanese:
            return ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日']; // Dias da semana em japonês
        default:
            return ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado']; // Padrão para idioma português
    }
};
