import e, * as express from 'express';
import { User } from "../../src/types/userType";
import { Log } from "../../src/types/logType";
import * as jwt from "jsonwebtoken";
export declare const Console: {
    log(...args: any[]): void;
    error(...args: any[]): void;
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
    default = 5
}
export declare function sendError(res: express.Response, errorType?: ErrorType, status?: number, menssage?: string): void;
export declare function sendFile(): {
    cssJs: (res: express.Response) => void;
    img: (res: express.Response) => void;
};
export declare function mkDir(no: String, svData: string): Promise<void>;
export declare function id(num?: number): string | false;
export declare function addLog(log: Log): Promise<any>;
interface TokenRequest extends e.Request {
    usuario?: string | jwt.JwtPayload;
}
export declare function loginUser(req: e.Request, res: e.Response): Promise<void>;
export declare function checkToken(req: TokenRequest, res: e.Response, next: e.NextFunction): Promise<void>;
export declare function addUser(user: User): Promise<User>;
export {};