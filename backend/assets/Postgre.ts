import {Pool} from "pg"
import { IP_DATABASE } from "../consts"

export const pool = new Pool({
    user:"server",
    host:"localhost",
    database:"users",
    password:"2587",
    port: 5432,
})
export const animeClient = new Pool({
    user:"server",
    host:IP_DATABASE,
    database:"anime",
    password:"254",
    port:5433
})
export const logPool = new Pool({
    user:"server",
    host:IP_DATABASE,
    database:"log"
})