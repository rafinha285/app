import $ from "jquery"
import {Anime, Producer,Season} from "../types/animeModel"
import AnimePoster from "../assets/AnimePosters"
import { Episode } from "../types/episodeModel";


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
        return data.map(item=>({
            id:item[0],
            name:item[1],
            episodes:item[2],
            index:item[3]
        }))
    }
    
}
export async function getEpsFromSeason(ani:string,season:string):Promise<Episode[]>{
    return await (await fetch(`/api/g/s/eps/${ani}/${season}`)).json()
}