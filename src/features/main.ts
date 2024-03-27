import { Anime, AnimeDocument } from "../types/animeModel"
import { Episode } from "../types/episodeModel"

export function getEpTime(ee:number):string{
    var e = Math.round(ee)
    var h = Math.floor(e/3600).toString()
    let m:string =""
    var s = (e%60).toString()
    var ar:string[] = []

    if (h === "0") {
        s = s.length === 1 ? (s = `0${s}`) : s;
        m = Math.floor((e % 3600) / 60).toString();
        m = m.length === 1 ? `0${m}` : m; // Correção aqui
        ar.push(m, s);
    } else {
        s= s.length === 1 ? (s = `0${s}`) : s;
        m = Math.floor((e % 3600) / 60).toString();
        m = m.length === 1 ? `0${m}` : m; // Correção aqui
        h= h.length === 1 ? (h = `0${h}`) : h;
        ar.push(h, m, s);
    }
    return ar.join(":");
}
export function trim(string:String,maxLength:number = 120):string{
    var t = string.substring(0,maxLength-3)
    console.log(t)
    t = t.substring(0,Math.min(t.length,t.lastIndexOf(" ")))+"..."
    return t
}
interface MonthNames {
    [key: string]: string[];
}
const monthNames:MonthNames={
    'pt-br': [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ],
}
export const getMonthName = (date:Date,short:boolean,locale = "pt-br"):string =>{
    const month = date.getMonth();
    const localeMonthNames = monthNames[locale];

    if (!localeMonthNames) {
        return '';
    }

    return short ? localeMonthNames[month].substring(0, 3) : localeMonthNames[month];
}
export function NextEp(ani:AnimeDocument,seasonId:string,ep:Episode){
    var eps = ani.seasons?.find(s=>s._id === seasonId)?.episodes!
    let indiceAtual=eps?.findIndex(e=>e._id === ep._id)
    let proximoEp = eps[indiceAtual!+1]
    return proximoEp
}
export const handleNextEp = (ani:AnimeDocument,seasonId:string,ep:Episode)=>{
    var proximoEp = NextEp(ani,seasonId,ep)
    window.location.href = `/Anime/${ani._id}/watch/${seasonId}/${proximoEp._id}`
}
