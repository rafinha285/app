import { useContext } from "react"
import { Anime } from "../types/animeModel"
import { Episode, languages } from "../types/episodeModel"
import GlobalContext, { GlobalContextType } from "../GlobalContext"
import { getDeviceIndentifier } from "../functions/userFunctions"

export function getEpTime(ee:number):string{
    var e = Math.round(ee)
    var h = Math.floor(e/3600).toString()
    let m:string =""
    var s = (e%60).toString()
    var ar:string[] = []

    if (h === "0") {
        s = s.length === 1 ? (s = `0${s}`) : s;
        m = Math.floor((e % 3600) / 60).toString();
        m = m.length === 1 ? `0${m}` : m;
        ar.push(m, s);
    } else {
        s= s.length === 1 ? (s = `0${s}`) : s;
        m = Math.floor((e % 3600) / 60).toString();
        m = m.length === 1 ? `0${m}` : m;
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
// export function NextEp(ani:AnimeDocument,seasonId:string,ep:Episode){
//     var eps = ani.seasons?.find(s=>s._id === seasonId)?.episodes!
//     let indiceAtual=eps?.findIndex(e=>e._id === ep._id)
//     let proximoEp = eps[indiceAtual!+1]
//     return proximoEp
// }
//var proximoEp = NextEp(ani,seasonId,ep)
//window.location.href = `/Anime/${ani.id}/watch/${seasonId}/${proximoEp.id}`
export async function handleEpWatching(ani:string, seasonId:string, ep:Episode,droppedOn:number,watched:boolean) {
    console.log(ep.id,watched,droppedOn)
    await fetch(`/api/log/watch/${ani}/${seasonId}/${ep.id}`,{
        method: "POST",
        body: JSON.stringify({
            duration:ep.duration,
            watched,
            droppedOn:droppedOn,
            ep_index:ep.epindex,
        }),
        headers:{
            "Accept":"application/json, text/plain, */*",
            "Content-Type":"application/json"
        }
    });
}
export const handleNextEp = (ani:string,seasonId:string,eps:Map<number,Episode>,index:number)=>{
    // if(isLogged){
    //     handleEpWatching(ani,seasonId,eps.sort((a,b)=>a.epindex-b.epindex)[index],time,true)
    // }
    console.log(eps)
    var p = eps.get(index+1)
    console.log(p)
    // console.log(ani,seasonId,eps,index)
    if(p){
        window.location.href = `/Anime/${ani}/watch/${seasonId}/${p.id}`
    }
}
export function nextEpUrl(eps:Episode[],ani:string,ep:Episode,):string|undefined{
    var posEp = eps.find(v=>v.epindex === (ep.epindex+1))
    if(posEp){
        console.log(ani,ep.season_id,posEp,posEp.id,`/Anime/${ani}/watch/${ep.season_id}/${posEp.id}`)
        return `/Anime/${ani}/watch/${ep.season_id}/${posEp.id}`
    }else{
        return undefined
    }
}
export function prevEpUrl(eps:Episode[],ani:string,ep:Episode,):string|undefined{
    var prevEp = eps.find(v=>v.epindex === (ep.epindex-1))
    if(prevEp){
        console.log(ani,ep.season_id,prevEp,prevEp.id,`/Anime/${ani}/watch/${ep.season_id}/${prevEp.id}`)
        return `/Anime/${ani}/watch/${ep.season_id}/${prevEp.id}`
    }else{
        return undefined
    }
}
declare global{
    interface Date{
        getDayOfWeekName():string;
        daysOfWeek(language?:languages):string[];
    }
}
export function DateToStringInput(dat:Date):string{
    let date:Date = new Date(dat)
    return date.toISOString().split("T")[0]
}
export function DateToStringLocal(dat:Date){
    let date:Date = new Date(dat)
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // O mês é baseado em zero
    const year = date.getFullYear();
    console.log(`${day}/${month}/${year}`)

  // Retorna a data formatada como uma string
  return `${day}/${month}/${year}`;
}
export function checkIsLogged(isLogged:boolean){
    if(!isLogged){
        alert("Nenhuma conta conectada")
        window.location.href = '/login/'
    }
}
export async function fetchPost(path:string,method:"POST"|"DELETE"|"PATCH" = "POST",body?:any){
    return await fetch(path,{
        method:method,
        headers: {'Content-Type': 'application/json'},
        body:JSON.stringify(body)
    })
}
export async function fetchUser(path:string,method:"POST"|"DELETE"|"PATCH"|"GET" = "POST",body?:any){
    let indentifier = getDeviceIndentifier()
    return await fetch(path,{
        method,
        headers:{
            'Content-Type':"application/json",
            'timeZone':indentifier.timeZone,
            'webGlRenderer':indentifier.WegGl?.renderer,
            'webGlVendor':indentifier.WegGl?.vendor,
        },
        body:JSON.stringify(body)
    })
}
export function isToday(date:Date) {
    const today = new Date();

    return date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();
}
Date.prototype.getDayOfWeekName = function(){
    // const daysOfWeek = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    let daysOfWeek = Date.prototype.daysOfWeek()
    const dayOfWeek = this.getDay(); // Retorna um número de 0 (Domingo) a 6 (Sábado)
    return daysOfWeek[dayOfWeek];
}
Date.prototype.daysOfWeek = (language:languages = languages.Portuguese) =>{
    switch (language) {
        case languages.Portuguese:
            return ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
        case languages.English:
            return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        case languages.Spanish:
            return ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']; // Dias da semana em espanhol
        case languages.Japanese:
            return ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日']; // Dias da semana em japonês
        default:
            return ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado']; // Padrão para idioma português
    }
}
