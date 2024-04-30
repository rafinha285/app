import e, * as express from 'express';
import { User } from "../../src/types/userType";
import { Log } from "../../src/types/logType";
import { PoolClient } from 'pg';
import { TokenRequest } from '../types';
export declare const Console: {
    log(...args: any[]): void;
    error(...args: any[]): void;
    warn(...args: any[]): void;
    info(...args: any[]): void;
};
export declare function setHeader(res: express.Response): void;
export declare function cut(string: string): string;
export declare function getTime(path: string): Promise<number>;
export declare enum ErrorType {
    NotId = 0,
    Exist = 1,
    undefined = 2,
    noToken = 3,
    invalidToken = 4,
    invalidReCaptcha = 5,
    invalidPassOrEmail = 6,
    invalidEmail = 7,
    unauthorized = 8,
    default = 9
}
export declare function sendError(res: express.Response, errorType?: ErrorType, status?: number, menssage?: string): void;
export declare function sendFile(): {
    cssJs: (res: express.Response) => void;
    img: (res: express.Response) => void;
};
export declare function mkDir(no: String, svData: string): Promise<void>;
export declare function id(num?: number): string | false;
export declare function openConnectionAnime(): Promise<PoolClient>;
export declare function rollbackAnime(): Promise<void>;
export declare function endConnectionAnime(client: PoolClient): Promise<void>;
export declare function addLog(log: Log): Promise<any>;
export declare function checkToken(req: TokenRequest, res: e.Response, next: e.NextFunction): void;
export declare function addUser(user: {
    name: string;
    surname: string;
    username: string;
    birthDate: Date;
    email: string;
    password: string;
    salt: string;
}): Promise<User>;
