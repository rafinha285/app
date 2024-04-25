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
exports.DateToStringLocal = exports.getEpsFromSeason = exports.tupleToSeason = exports.tupleToProducer = exports.genToArray = void 0;
var types_1 = require("../types/types");
function genToArray(gen) {
    console.log(gen);
    var s = gen.slice(1, -1);
    return s.split(',');
}
exports.genToArray = genToArray;
function tupleToProducer(data) {
    return data.map(function (item) { return ({
        id: item[0],
        name: item[1]
    }); });
}
exports.tupleToProducer = tupleToProducer;
function tupleToSeason(data) {
    console.log(data);
    if (data == null) {
        return [];
    }
    else {
        if (data[0].elements) {
            return data.map(function (item) { return ({
                id: item.elements[0],
                name: item.elements[1],
                episodes: item.elements[2],
                index: item.elements[3]
            }); });
        }
        else {
            return data.map(function (item) { return ({
                id: item[0],
                name: item[1],
                episodes: item[2],
                index: item[3]
            }); });
        }
    }
}
exports.tupleToSeason = tupleToSeason;
function getEpsFromSeason(ani, season) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch("/api/g/s/eps/".concat(ani, "/").concat(season))];
                case 1: return [4 /*yield*/, (_a.sent()).json()];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.getEpsFromSeason = getEpsFromSeason;
function DateToStringLocal(date) {
    var day = String(date.getDate()).padStart(2, '0');
    var month = String(date.getMonth() + 1).padStart(2, '0'); // O mês é baseado em zero
    var year = date.getFullYear();
    // Retorna a data formatada como uma string
    return "".concat(day, "/").concat(month, "/").concat(year);
}
exports.DateToStringLocal = DateToStringLocal;
Date.prototype.getDayOfWeekName = function () {
    // const daysOfWeek = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    var daysOfWeek = Date.prototype.daysOfWeek();
    var dayOfWeek = this.getDay(); // Retorna um número de 0 (Domingo) a 6 (Sábado)
    return daysOfWeek[dayOfWeek];
};
Date.prototype.daysOfWeek = function (language) {
    if (language === void 0) { language = types_1.languages.Portuguese; }
    switch (language) {
        case types_1.languages.Portuguese:
            return ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
        case types_1.languages.English:
            return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        case types_1.languages.Spanish:
            return ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']; // Dias da semana em espanhol
        case types_1.languages.Japanese:
            return ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日']; // Dias da semana em japonês
        default:
            return ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado']; // Padrão para idioma português
    }
};
