/// <reference types="node" />
import mongoose, { Document } from "mongoose";
import * as express from 'express';
import * as path from "path";
export declare const aniCol: mongoose.Collection;
export declare const aniEp: mongoose.Collection;
export interface episode {
    _id: mongoose.ObjectId;
    Index: number;
    epNom: String;
    Op: {
        Inicial: Number;
        Final: Number;
    };
    Ed: Number;
    Data: Date;
    Time: Number;
    Quality: string[];
    path: {
        Video: path.FormatInputPathObject;
        Img: path.FormatInputPathObject;
    };
}
interface Season {
    _id: mongoose.ObjectId;
    Name: string;
    Index: number;
    episodes: episode[];
    DateLan: Date;
}
export declare class season {
    constructor(s: Season);
}
interface aniModelContent {
    Nom2: string;
    Desc: string;
    Generos: string[];
    Data: Date;
    Qualidade: string;
    State: string;
    Idioma: string;
    EpTime: number;
    Produtor: string[];
    Studio: string[];
    Creator: string[];
    Seasons: Season[];
    pathToImg: string;
    path: string;
    note: number;
}
export interface aniMod extends Document {
    Nom: String;
    content: aniModelContent;
}
export declare const Console: {
    log(...args: any[]): void;
    error(...args: any[]): void;
};
export declare const aniModel: mongoose.Model<aniMod, {}, {}, {}, mongoose.Document<unknown, {}, aniMod> & aniMod & {
    _id: mongoose.Types.ObjectId;
}, any>;
export declare const Ani: mongoose.Model<aniMod, {}, {}, {}, mongoose.Document<unknown, {}, aniMod> & aniMod & {
    _id: mongoose.Types.ObjectId;
}, mongoose.Schema<aniMod, mongoose.Model<aniMod, any, any, any, mongoose.Document<unknown, any, aniMod> & aniMod & {
    _id: mongoose.Types.ObjectId;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, aniMod, mongoose.Document<unknown, {}, mongoose.FlatRecord<aniMod>> & mongoose.FlatRecord<aniMod> & {
    _id: mongoose.Types.ObjectId;
}>>;
export declare function setHeader(res: express.Response): void;
export declare function cut(string: string): string;
export declare function getTime(path: string): Promise<number>;
export declare enum ErrorType {
    NotId = 0,
    Exist = 1,
    undefined = 2,
    default = 3
}
export declare function sendError(res: express.Response, errorType?: ErrorType, status?: number, menssage?: string): void;
export declare function sendFile(): {
    cssJs: (res: express.Response) => void;
    img: (res: express.Response) => void;
};
export declare function mkDir(no: String, svData: string): Promise<void>;
export declare function id(num?: number): string | false;
export declare function checkSeason(Seasons: Season[], pathToVid: string): Promise<void>;
export {};
