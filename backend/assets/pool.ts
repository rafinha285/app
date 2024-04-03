import {Client}from'cassandra-driver';
import { IP_DATABASE } from '../consts';

export const client = new Client({
    contactPoints:[IP_DATABASE],
    localDataCenter:"datacenter1",
    keyspace:"data"
})