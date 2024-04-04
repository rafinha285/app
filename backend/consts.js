"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IP_DATABASE = exports.HTTPS_CERT_PATH = exports.HTTPS_KEY_PATH = exports.BUILD_PATH = exports.RESOLUTIONS = exports.FFPROBE_PATH = exports.FFMPEG_PATH = exports.TEMP_PATH = exports.MANGA_PATH = exports.ANIME_PATH = void 0;
var path = require("path");
exports.ANIME_PATH = path.join("~/", 'storage', 'anime');
exports.MANGA_PATH = path.join("~/", 'storage', 'manga');
exports.TEMP_PATH = path.join("~/", 'storage', 'temp');
exports.FFMPEG_PATH = path.join('usr', 'bin', 'ffmpeg');
exports.FFPROBE_PATH = path.join('usr', 'bin', 'ffprobe');
exports.RESOLUTIONS = ['1920x1080', '1280x720', '854x480'];
exports.BUILD_PATH = path.join(__dirname, '../', 'build');
exports.HTTPS_KEY_PATH = path.join(__dirname, "../", "../", "https", 'chave.pem');
exports.HTTPS_CERT_PATH = path.join(__dirname, "../", "../", "https", 'certificado.pem');
exports.IP_DATABASE = '192.168.1.20';
