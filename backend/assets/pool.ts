import {Client}from'cassandra-driver';

export const client = new Client({
    contactPoints:['192.168.1.30'],
    localDataCenter:"datacenter1",
    keyspace:"data"
})