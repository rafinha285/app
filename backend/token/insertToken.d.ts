/// <reference types="cookie-parser" />
import * as e from "express";
export default function insertToken(req: e.Request, user: {
    _id: string;
    username: string;
    user_agent: string;
    time_zone: string;
    web_gl_vendor: string;
    web_gl_renderer: string;
}): Promise<string>;
