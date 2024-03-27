"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.animeClient = exports.pool = void 0;
var pg_1 = require("pg");
exports.pool = new pg_1.Pool({
    user: "server",
    host: "localhost",
    database: "users",
    password: "2587",
    port: 5432,
});
exports.animeClient = new pg_1.Pool({
    user: "postgres",
    host: "192.168.1.11",
    database: "anime",
    password: "285",
    port: 5433
});
