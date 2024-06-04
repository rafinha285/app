import React from "react"
import { Season, SeasonList } from "../../types/animeModel"

interface props{
    season:Season
    onChange:(e:React.ChangeEvent<HTMLInputElement>,season:string)=>void;
    seasonList?:SeasonList
}
const AnimeListSeason:React.FC<props> = ({season, onChange,seasonList}) =>{
    console.log(seasonList)
    return(
        <div style={{border:"1px white solid",borderRadius:"5px",margin:"10px 0",padding:"10px"}}>
            <p>Season: {season.name}</p>
            <div>
                <p style={{fontSize:"10px"}}>Episódios Assistidos: </p> 
                <input style={{width: "60px"}} type="number" max={season.episodes.length} value={seasonList?seasonList.total_episodes:0} onChange={(e)=>onChange(e,season.id)}/><p style={{display:"inline"}}>/{season.episodes.length}</p>
            </div>
        </div>
    )
}
export default AnimeListSeason