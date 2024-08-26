import React, { useContext, useEffect, useState } from "react"
import { Anime, AnimeUser, Season, SeasonList } from "../types/animeModel"
import { priorityValue, userAnimeState } from "../types/types"
import { Box, Rating } from "@mui/material"
import { getLabelText, tupleToSeason } from "../functions/animeFunctions"
import AnimeStar from "./AnimeStart"
import GlobalContext from "../GlobalContext"
import { DateToStringInput, DateToStringLocal } from "../features/main"
import axios from "axios"
import AnimeListSeason from "../assets/AnimeList/AnimeSeason"

interface props{
    onClose:()=>void
    ani:AnimeUser
}
const AnimeEditList:React.FC<props> = ({onClose,ani})=>{
    const [ratingHover,setRatingHover] = useState(-1)
    const [ratingValue,setRatingValue] = useState<number>(ani.rate)
    const [startDate,setStartDate] = useState<Date|undefined>(ani.start_date)
    const [endDate,setEndDate] = useState<Date|undefined>(ani.finish_date)
    const [state,setState] = useState<userAnimeState>(ani.status)
    // const [timesWatched,setTimesWatched] = useState<number|undefined>(ani.times_watched)
    const [season,setSeason] = useState<Season[]>()
    const [seasonsList,setSeeasonsList] = useState<SeasonList[]>()
    const [priority,setPriority] = useState<priorityValue>(ani.priority)
    // const [watchedEpisodes,setWatchedEpisodes] = useState<number>(ani.watched_episodes)
    // const [rewatchedEpisodes,setRewatchedEpisodes] = useState<number|undefined>(ani.watched_episodes)
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
            case changeEnum.priority:
                setPriority(e.target.value as priorityValue)
                break
        }
    }
    useEffect(()=>{
        const handleGetSeasons = async()=>{
            await fetch(`/api/g/seasons/${ani.anime_id}`)
                .then((response)=>response.json())
                .then((data:any)=>{
                    console.log(tupleToSeason(data))
                    setSeason(tupleToSeason(data))
                })
            await fetch(`/api/user/animelist/season/${ani.anime_id}`)
                .then((response)=>response.json())
                .then((data)=> {
                    console.log(data)
                    setSeeasonsList(data)
                })
        }
        handleGetSeasons()
        // var arr:SeasonList[] = []
        // for(let i = 0;i<season!.length!;i++){
        //     let currentSeason = (season!)[i]
        //     let currentSeasonList = seasonsList?.find((v,i)=>v.season_id === currentSeason.id)
        //     var d:SeasonList ={
        //         anime_id:ani.anime_id,
        //         season_id:currentSeason.id,
        //         total_episodes:currentSeasonList?.total_episodes!
        //     }
        // }
    },[])
    const handleUpdateList = async() =>{
        let body = {
            id:ani.id,
            // watched_episodes:watchedEpisodes,
            start_date:startDate,
            finish_date:endDate,
            rate:ratingValue,
            state,
            priority,
            seasons:seasonsList!
            // times_watched:timesWatched,
            // rewatched_episodes:rewatchedEpisodes
        }
        await axios.patch('/api/user/animelist/update',body)
        .then((res)=>{
            alert(res.data.message)
            onClose()
        })
    }
    const handleSeasonChange = (e:React.ChangeEvent<HTMLInputElement>,season:string) =>{
        var currentSeason = seasonsList?.find(v=>v.season_id===season)!;
        currentSeason.total_episodes = parseInt(e.target.value)
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
                {/*<div>*/}
                {/*    {season?.sort((a,b)=>a.index - b.index).map((v)=>{*/}
                {/*        let currentSea = seasonsList?.find(vS=>vS.season_id===v.id)!*/}
                {/*        console.log(seasonsList)*/}
                {/*        return <AnimeListSeason season={v} onChange={handleSeasonChange} seasonList={currentSea}/>*/}
                {/*    })}*/}
                {/*    /!* <p>Episódios Assistidos: </p>*/}
                {/*    <input type="number" value={watchedEpisodes} onChange={(e)=>handleChange(e,changeEnum.watchedEpisodes)}></input> *!/*/}
                {/*</div>*/}
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
                {/* <p>Vezes asistido</p> */}
                {/* <input type="number" onChange={(e)=>handleChange(e,changeEnum.timesWatched)} value={timesWatched}></input> */}
                {

                }
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
