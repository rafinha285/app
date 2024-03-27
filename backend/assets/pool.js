"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
var cassandra_driver_1 = require("cassandra-driver");
exports.client = new cassandra_driver_1.Client({
    contactPoints: ['192.168.1.30'],
    localDataCenter: "datacenter1",
    keyspace: "data"
});
