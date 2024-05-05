import React, { useContext, useState } from "react"
import { Anime, AnimeUser } from "../types/animeModel"
import { priorityValue, userAnimeState } from "../types/types"
import { Box, Rating } from "@mui/material"
import { getLabelText } from "../functions/animeFunctions"
import AnimeStar from "./AnimeStart"
import GlobalContext from "../GlobalContext"
import { DateToStringInput, DateToStringLocal } from "../features/main"

interface props{
    onClose:()=>void
    ani:AnimeUser
}
const AnimeEditList:React.FC<props> = ({onClose,ani})=>{
    const [ratingHover,setRatingHover] = useState(-1)
    const [ratingValue,setRatingValue] = useState<number>(ani.rate)
    const [startDate,setStartDate] = useState<Date|undefined>(ani.start_date)
    const [endDate,setEndDate] = useState<Date|undefined>(ani.finish_date)
    const [state,setState] = useState<userAnimeState>(ani.state)
    const [timesWatched,setTimesWatched] = useState<number|undefined>(ani.times_watched)
    const [priority,setPriority] = useState<priorityValue>(ani.priority)
    const [watchedEpisodes,setWatchedEpisodes] = useState<number>(ani.watched_episodes)
    const [rewatchedEpisodes,setRewatchedEpisodes] = useState<number|undefined>(ani.watched_episodes)
    const context = useContext(GlobalContext)!
    console.log(ani)
    enum changeEnum{
        startDate,
        endDate,
        state,
        timesWatched,
        priority, 
        watchedEpisodes,
        rewatchedEpisodes
    }
    const handleChange=(e:React.ChangeEvent<HTMLInputElement|HTMLSelectElement>,changeeEnum:changeEnum)=>{
        switch(changeeEnum){
            case changeEnum.startDate:
                setStartDate(new Date(e.target.value))
                break
            case changeEnum.endDate:
                setEndDate(new Date(e.target.value))
                break
            case changeEnum.state:
                setState(e.target.value as userAnimeState)
                break
            case changeEnum.timesWatched:
                setTimesWatched(parseInt(e.target.value))
                break
            case changeEnum.priority:
                setPriority(e.target.value as priorityValue)
                break
            case changeEnum.watchedEpisodes:
                setWatchedEpisodes(parseInt(e.target.value))
                break
            case changeEnum.rewatchedEpisodes:
                setRewatchedEpisodes(parseInt(e.target.value))
                break
        }
    }
    const handleUpdateList = async() =>{
        let body = {
            watched_episodes:watchedEpisodes,
            start_date:startDate,
            finish_date:endDate,
            rate:ratingValue,
            state,
            priority,
            times_watched:timesWatched,
            rewatched_episodes:rewatchedEpisodes
        }
        await fetch('/api/user/animelist/update',{method:"PATCH",body:body.toString()})
        .then(response=>response.json())
        .then((data)=>{
            if(data.success){
                alert("Atualizado com sucesso")
                onClose()
            }else{
                alert(data.message)
                onClose()
            }
        })
    }
    const handleDeleteList = async()=>{

    }
    return(
        <div className="edit-list-content">
            <button onClick={onClose} className="close-popup"><i className="fa-solid fa-x"></i></button>
            <div className="edit-list">
                <div style={{display:"flex"}}>
                    <button className="update-button" onClick={handleUpdateList}>Update Anime</button>
                    <button className="update-button" onClick={handleDeleteList}>Delete Anime</button>
                </div>
                <p>Editar Anime: {ani.name}</p>
                <div className="status">
                    <p>Status: </p>
                    <select value={state} onChange={(e)=>{handleChange(e,changeEnum.state)}}>{Object.values(userAnimeState).map((v,i)=>(
                        <option value={v} key={i}>{v}</option>
                    ))}</select>
                </div>
                <div>
                    <p>Episódios Assistidos: </p>
                    <input type="number" value={watchedEpisodes} onChange={(e)=>handleChange(e,changeEnum.watchedEpisodes)}></input>
                </div>
                <div>
                    <div>
                        <p>Rating: </p>
                        <AnimeStar ratingHover={ratingHover} setRatingHover={setRatingHover} setRatingValue={setRatingValue} context={context} aniId={ani.anime_id} ratingValue={ratingValue}/>
                    </div>
                </div>
                <div>
                    <div>
                        <p>Data de começo: </p>
                        {/* startDate?DateToStringLocal(startDate):"" */}
                        <input type="date" onChange={(e)=>handleChange(e,changeEnum.startDate)} value={startDate?DateToStringInput(startDate):""}/>
                        <p>Data de fim: </p>
                        {/* endDate?DateToStringLocal(endDate):"" */}
                        <input type="date" onChange={(e)=>handleChange(e,changeEnum.endDate)} value={endDate?DateToStringInput(endDate):""}></input>
                    </div>
                </div>
                <p>Vezes asistido</p>
                <input type="number" onChange={(e)=>handleChange(e,changeEnum.timesWatched)} value={timesWatched}></input>
                {ani.times_watched&&ani.times_watched>=1?(
                    <>
                        <p>Episodios Assistidos</p>
                        <input value={rewatchedEpisodes} onChange={(e)=>handleChange(e,changeEnum.rewatchedEpisodes)}/>
                    </>
                ):(<></>)}
                <div className="status">
                    <p>Prioridade: </p>
                    <select value={priority} onChange={(e)=>handleChange(e,changeEnum.priority)}>
                        {Object.keys(priorityValue).map((v,i)=>(
                            <option value={v}>{priorityValue[v as keyof typeof priorityValue]}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    )
}
export default AnimeEditList