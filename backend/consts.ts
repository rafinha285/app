import * as path from "path"
export const ANIME_PATH:string = path.join("D:","main","server","Anime")
export const MANGA_PATH:string = path.join("D:","main","server","Manga")
export const TEMP_PATH:string = path.join("D:","main","server","temp")
export const FFMPEG_PATH:string = path.join("D:","main","ffmpeg","bin","ffmpeg.exe")
export const FFPROBE_PATH:string = path.join("D:","main","ffmpeg","bin","ffprobe.exe")
export const RESOLUTIONS:string[] = ['1920x1080','1280x720', '854x480']
export const BUILD_PATH:string = path.join(__dirname,'../','build')
export const HTTPS_KEY_PATH:string = path.join(__dirname,"../","../","https",'chave.pem')
export const HTTPS_CERT_PATH:string = path.join(__dirname,"../","../","https",'certificado.pem')
export const IP_DATABASE:string = 'localhost'