import $ from "jquery"
import {Anime, Producer,Season} from "../types/animeModel"
import AnimePoster from "../assets/AnimePosters"
import { Episode } from "../types/episodeModel";
import { languages } from "../types/types.ts";


export function genToArray(gen:string){
    console.log(gen)
    var s = gen.slice(1, -1);
    return s.split(',')
}
export function tupleToProducer(data:any[]):Producer[]{
    return data.map(item =>({
        id:item[0],
        name:item[1]
    }))
}
export function tupleToSeason(data:any[]):Season[]{
    console.log(data)
    if(data == null){
        return []
    }else{
        if(data[0].elements){
            return data.map(item=>({
                id:item.elements[0],
                name:item.elements[1],
                episodes:item.elements[2],
                index:item.elements[3]
            }))
        }else{
            return data.map(item=>({
                id:item[0],
                name:item[1],
                episodes:item[2],
                index:item[3]
            }))
        }
    }
    
}
export async function getEpsFromSeason(ani:string,season:string):Promise<Episode[]>{
    return await (await fetch(`/api/g/s/eps/${ani}/${season}`)).json()
}

declare global{
    interface Date{
        getDayOfWeekName():string;
        daysOfWeek(language?:languages):string[];
    }
}

export function DateToStringLocal(date:Date){
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // O mês é baseado em zero
    const year = date.getFullYear();

  // Retorna a data formatada como uma string
  return `${day}/${month}/${year}`;
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