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
exports.checkToken = void 0;
var jwt = require("jsonwebtoken");
var config_1 = require("../secret/config");
var handle_1 = require("../assets/handle");
var Postgre_1 = require("../database/Postgre");
var deleteToken_1 = require("./deleteToken");
function checkToken(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var tokenHeader, tokencookie, token, jwtResult, user, result, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 4, , 5]);
                    tokenHeader = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
                    tokencookie = req.cookies.token;
                    token = tokenHeader || tokencookie;
                    if (!token) {
                        return [2 /*return*/, (0, handle_1.sendError)(res, handle_1.ErrorType.noToken)];
                    }
                    jwtResult = void 0;
                    try {
                        jwtResult = jwt.verify(token, config_1.secretKey);
                    }
                    catch (err) {
                        // Captura erros do JWT, como tokens inválidos ou expirados
                        return [2 /*return*/, (0, handle_1.sendError)(res, handle_1.ErrorType.invalidToken)];
                    }
                    user = jwtResult;
                    return [4 /*yield*/, Postgre_1.pgClient.query("\n            SELECT expires_at\n                FROM users.users_sessions\n                WHERE user_id = $1\n                AND user_agent = $2 \n                AND time_zone = $3 \n                AND web_gl_vendor = $4 \n                AND web_gl_renderer = $5 \n        ", [user._id, user.user_agent, user.time_zone, user.web_gl_vendor, user.web_gl_renderer])
                        // Console.log(parseInt(result.rows[0].count) === 0)
                    ];
                case 1:
                    result = _b.sent();
                    // Console.log(parseInt(result.rows[0].count) === 0)
                    if (result.rows.length === 0) {
                        return [2 /*return*/, (0, handle_1.sendError)(res, handle_1.ErrorType.unauthorized)];
                    }
                    if (!(new Date(result.rows[0].expires_at).getTime() < new Date().getTime())) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, deleteToken_1.default)(req)];
                case 2:
                    _b.sent();
                    return [2 /*return*/, (0, handle_1.sendError)(res, handle_1.ErrorType.unauthorized)];
                case 3:
                    req.user = user;
                    next();
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _b.sent();
                    next(err_1);
                    throw err_1;
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.checkToken = checkToken;
