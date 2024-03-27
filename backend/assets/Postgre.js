"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logPool = exports.pool = void 0;
var pg_1 = require("pg");
exports.pool = new pg_1.Pool({
    user: "server",
    host: "localhost",
    database: "users",
    password: "2587",
    port: 5432,
});
exports.logPool = new pg_1.Pool({
    user: "server",
    host: "localhost",
    database: "log",
    password: "2587",
    port: 5432
});
