import { Client } from "cassandra-driver";

declare global{
    namespace Express {
        interface Request{
            db:Client
        }
    }
}