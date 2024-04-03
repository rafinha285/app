"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IP_DATABASE = exports.RESOLUTIONS = exports.FFPROBE_PATH = exports.FFMPEG_PATH = exports.TEMP_PATH = exports.MANGA_PATH = exports.ANIME_PATH = void 0;
var path = require("path");
exports.ANIME_PATH = path.join("D:", "main", "server", "Anime");
exports.MANGA_PATH = path.join("D:", "main", "server", "Manga");
exports.TEMP_PATH = path.join("D:", "main", "server", "temp");
exports.FFMPEG_PATH = path.join("D:", "main", "ffmpeg", "bin", "ffmpeg.exe");
exports.FFPROBE_PATH = path.join("D:", "main", "ffmpeg", "bin", "ffprobe.exe");
exports.RESOLUTIONS = ['1920x1080', '1280x720', '854x480'];
exports.IP_DATABASE = '192.168.1.20';
