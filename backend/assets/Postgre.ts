import {Pool} from "pg"

export const pool = new Pool({
    user:"server",
    host:"localhost",
    database:"users",
    password:"2587",
    port: 5432,
})
export const animeClient = new Pool({
    user:"postgres",
    host:"192.168.1.11",
    database:"anime",
    password:"285",
    port:5433
})