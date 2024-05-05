"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIsLogged = exports.DateToStringLocal = exports.prevEpUrl = exports.nextEpUrl = exports.handleNextEp = exports.getMonthName = exports.trim = exports.getEpTime = void 0;
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
var handleNextEp = function (ani, seasonId, eps, index) {
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
