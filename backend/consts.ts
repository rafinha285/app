import * as path from "path"
export const IP_DATABASE:string = '192.168.18.20'
export const ANIME_PATH:string = path.join('/','mnt','storage','anime')
export const MANGA_PATH:string = path.join('/','mnt','storage','manga')
export const TEMP_PATH:string = path.join('/','mnt','temp')
// export const ANIME_PATH:string = path.join(`\\\\${IP_DATABASE}`,'anime')
// export const MANGA_PATH:string = path.join(`\\\\${IP_DATABASE}`,'manga')
// export const TEMP_PATH:string = path.join(`\\\\${IP_DATABASE}`,'temp')
export const FFMPEG_PATH:string = path.join('/','usr','bin','ffmpeg')
export const FFPROBE_PATH:string = path.join('/','usr','bin','ffprobe')
export const RESOLUTIONS:string[] = ['1920x1080','1280x720', '854x480']
export const BUILD_PATH:string = path.join(__dirname,'../','build')
export const BUILD_HTML:string = path.join(BUILD_PATH,"index.html")
export const HTTPS_KEY_PATH:string = path.join('/','etc','letsencrypt','live','animefoda.top','privkey.pem')
export const HTTPS_CERT_PATH:string = path.join('/','etc','letsencrypt','live','animefoda.top','fullchain.pem')
