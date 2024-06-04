"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logPool = exports.animeClient = exports.pool = void 0;
var pg_1 = require("pg");
var consts_1 = require("../consts");
exports.pool = new pg_1.Pool({
    user: "server",
    host: "localhost",
    database: "users",
    password: "2587",
    port: 5432,
});
exports.animeClient = new pg_1.Pool({
    user: "server",
    host: consts_1.IP_DATABASE,
    database: "anime",
    password: "254",
    port: 5433
});
exports.logPool = new pg_1.Pool({
    user: "server",
    host: consts_1.IP_DATABASE,
    database: "log",
    password: "254",
    port: 5433
});
