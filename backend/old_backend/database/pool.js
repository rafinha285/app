"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
var cassandra_driver_1 = require("cassandra-driver");
var consts_1 = require("../consts");
exports.client = new cassandra_driver_1.Client({
    contactPoints: [consts_1.IP_DATABASE],
    localDataCenter: "datacenter1",
    keyspace: "data"
});
