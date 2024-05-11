import React from "react"
import { Season, SeasonList } from "../../types/animeModel"

interface props{
    season:Season
    onChange:(e:React.ChangeEvent<HTMLInputElement>,season:string)=>void;
    seasonList:SeasonList
}
const AnimeListSeason:React.FC<props> = ({season, onChange,seasonList}) =>{
    return(
        <div style={{border:"1px white solid",borderRadius:"5px",margin:"10px 0"}}>
            <p>Season: {season.name}</p>
            <div>
                <p style={{fontSize:"10px"}}>Episódios Assistidos: </p> 
                <input type="number" max={season.episodes.length} value={seasonList.total_episodes} onChange={(e)=>onChange(e,season.id)}/><p>/{season.episodes.length}</p>
            </div>
        </div>
    )
}
export default AnimeListSeason