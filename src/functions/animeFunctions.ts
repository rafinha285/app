import $ from "jquery"
import {Anime, Producer} from "../types/animeModel"
import AnimePoster from "../assets/AnimePosters"


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