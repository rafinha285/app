import {Pool} from "pg"

export const pool = new Pool({
    user:"server",
    host:"localhost",
    database:"users",
    password:"2587",
    port: 5432,
})
export const logPool = new Pool({
    user:"server",
    host:"localhost",
    database:"log",
    password:"2587",
    port:5432
})