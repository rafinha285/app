import React from "react"
import { Season } from "../../types/animeModel"

interface props{
    season:Season
    onChange:(e:React.ChangeEvent<HTMLInputElement>,season:string)=>void;
}
const AnimeListSeason:React.FC<props> = ({season, onChange}) =>{
    return(
        <div>
            <p>Season: {season.name}</p>
            <div>
                <p>Episódios Assistidos: </p> 
                <input type="number" max={season.episodes.length} onChange={(e)=>onChange(e,season.id)}/>/{season.episodes.length}
            </div>
        </div>
    )
}
export default AnimeListSeason