"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var crypt = require("crypto");
console.log(crypt.randomBytes(256).toString("base64"));
