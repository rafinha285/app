import $ from "jquery"
import {Anime, AnimeUser, Producer,Season} from "../types/animeModel"
import AnimePoster from "../assets/AnimePosters"
import { Episode } from "../types/episodeModel";
import { checkIsLogged } from "../features/main";
import { GlobalContextType } from "../GlobalContext";
// import { languages } from "../types/episodeModel";


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
    // console.log(data)
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
export const parseAnime = (animeString:string) => {
    const animeValues = animeString.replace(/[\(\)"]/g, '').split(',');

    return {
        id: animeValues[0],
        name: animeValues[1],
        watched_episodes: parseInt(animeValues[2]),
        start_date: animeValues[3],
        finish_date: animeValues[4],
        rate: parseFloat(animeValues[5]),
        state: animeValues[6],
        times_watched: parseInt(animeValues[7]),
        priority: animeValues[8],
        rewatched_episodes: parseInt(animeValues[9]),
        last_ep: JSON.parse(animeValues[10])
    };
};

export function getLabelText(value: number,ratingValue:{[index:string]:string}) {
    return `${value} Star${value !== 1 ? 's' : ''}, ${ratingValue[value]}`;
}
export const handleRatingValue = async(value:number,context:GlobalContextType,ani:string,setRatingValue:React.Dispatch<React.SetStateAction<number>>) =>{
    checkIsLogged(context.isLogged)
    await fetch(`/api/user/anime/${ani}/editrating`,{method:"POST",body:({ratingValue:value}).toString()})
        .then(response =>response.json())
        .then(data=>{
            if(data.success){
                setRatingValue(value)
            }else{
                console.error(data.message)
            }
        })
}
