import React, { useContext, useState } from "react"
import { Anime, AnimeUser } from "../types/animeModel"
import { userAnimeState } from "../types/types"
import { Box, Rating } from "@mui/material"
import { getLabelText } from "../functions/animeFunctions"
import AnimeStar from "./AnimeStart"
import GlobalContext from "../GlobalContext"

interface props{
    onClose:()=>void
    ani:AnimeUser
}
const AnimeEditList:React.FC<props> = ({onClose,ani})=>{
    const [ratingHover,setRatingHover] = useState(-1)
    const [ratingValue,setRatingValue] = useState<number>()
    const context = useContext(GlobalContext)!
    const handleUpdateList = async() =>{
        
    }
    return(
        <div className="edit-list-content">
            <button onClick={onClose} className="close-popup"><i className="fa-solid fa-x"></i></button>
            <div className="edit-list">
                <p>Editar Anime: {ani.name}</p>
                <div className="status">
                    <p>Status: </p>
                    <select onChange={()=>{}}>{Object.values(userAnimeState).map((v,i)=>(
                        <option value={v} key={i}>{v}</option>
                    ))}</select>
                </div>
                <p>Episódios Assistidos: {ani.watched_episodes}</p>
                <div>
                    <div>
                        <p>Rating: </p>
                        <AnimeStar ratingHover={ratingHover} setRatingHover={setRatingHover} context={context} ani={ani} ratingValue={ratingValue}/>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default AnimeEditList