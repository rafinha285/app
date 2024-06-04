"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var Cconsole = {
    log: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        console.log.apply(console, __spreadArray(["[".concat(new Date(Date.now()).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }), "]:")], args, false));
    },
    error: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        console.error.apply(console, __spreadArray(["[ERROR:".concat(new Date(Date.now()).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }), "]:")], args, false));
    },
    warn: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        console.warn.apply(console, __spreadArray(["[WARN:".concat(new Date(Date.now()).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }), "]")], args, false));
    },
    info: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        console.info.apply(console, __spreadArray(["[INFO:".concat(new Date(Date.now()).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }), "]")], args, false));
    }
};
exports.default = Cconsole;
