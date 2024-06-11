"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IP_DATABASE = exports.HTTPS_CERT_PATH = exports.HTTPS_KEY_PATH = exports.BUILD_HTML = exports.BUILD_PATH = exports.RESOLUTIONS = exports.FFPROBE_PATH = exports.FFMPEG_PATH = exports.TEMP_PATH = exports.MANGA_PATH = exports.ANIME_PATH = void 0;
var path = require("path");
exports.ANIME_PATH = path.join(__dirname, '../', '../', 'storage', 'anime');
exports.MANGA_PATH = path.join(__dirname, '../', '../', 'storage', 'manga');
exports.TEMP_PATH = path.join(__dirname, '../', '../', 'storage', 'temp');
exports.FFMPEG_PATH = path.join('/', 'usr', 'bin', 'ffmpeg');
exports.FFPROBE_PATH = path.join('/', 'usr', 'bin', 'ffprobe');
exports.RESOLUTIONS = ['1920x1080', '1280x720', '854x480'];
exports.BUILD_PATH = path.join(__dirname, '../', 'build');
exports.BUILD_HTML = path.join(exports.BUILD_PATH, "index.html");
exports.HTTPS_KEY_PATH = path.join('/', 'etc', 'letsencrypt', 'live', 'animefoda.top', 'privkey.pem');
exports.HTTPS_CERT_PATH = path.join('/', 'etc', 'letsencrypt', 'live', 'animefoda.top', 'fullchain.pem');
exports.IP_DATABASE = '192.168.18.20';
