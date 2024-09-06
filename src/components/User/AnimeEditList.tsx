import React, {useContext, useEffect, useState} from "react"
import {AnimeUser} from "../../types/animeModel"
import {priorityValue, userAnimeState} from "../../types/types"
import GlobalContext from "../../GlobalContext"
import {DateToStringInput, fetchUser, isToday} from "../../features/main"

interface props{
    onClose:()=>void
    ani:AnimeUser,
    // seasons:Season[],
    // episodes:Episode[]
}
const AnimeEditList:React.FC<props> = ({onClose,ani})=>{
    const [ratingValue,setRatingValue] = useState<string>(ani?.rate.toString())
    const [startDate,setStartDate] = useState<Date|undefined>(ani.start_date)
    const [endDate,setEndDate] = useState<Date|undefined>(ani.finish_date)
    const [status,setStatus] = useState<userAnimeState>(ani.status)
    const [priority,setPriority] = useState<priorityValue>(ani.priority)
    const context = useContext(GlobalContext)!
    console.log(ani)
    enum changeEnum{
        startDate,
        endDate,
        status,
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
            case changeEnum.status:
                if((e.target.value as userAnimeState) === userAnimeState.completed && endDate === undefined){
                    setEndDate(new Date())
                }
                setStatus(e.target.value as userAnimeState)
                break
            case changeEnum.priority:
                setPriority(e.target.value as priorityValue)
                break
        }
    }
    useEffect(()=>{
        const handleGetSeasons = async()=>{
            // await fetch(`/ani/g/seasons/${ani.anime_id}`)
            //     .then((response)=>response.json())
            //     .then((data:any)=>{
            //         console.log(data)
            //         // setSeason(data)
            //     })
            // await fetch(`/api/user/animelist/season/${ani.anime_id}`)
            //     .then((response)=>response.json())
            //     .then((data)=> {
            //         console.log(data)
            //         setSeeasonsList(data)
            //     })
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
            anime_id:ani.anime_id,
            start_date:startDate?isToday(new Date(startDate))?new Date():startDate:null,
            finish_date:endDate?isToday(new Date(endDate))?new Date():endDate:null,
            // rate:ratingValue,
            status,
            priority,
        }
        if(!(ratingValue === undefined)){
            await fetchUser(`/user/animelist/rating/${ani.anime_id}`,'POST',{rating:ratingValue})
        }
        await fetchUser('/user/animelist/update/','PATCH',body)
        .then(async (res)=>{
            alert((await res.json()).message)
            onClose()
        })
    }
    // const handleSeasonChange = (e:React.ChangeEvent<HTMLInputElement>,season:string) =>{
    //     var currentSeason = seasonsList?.find(v=>v.season_id===season)!;
    //     currentSeason.total_episodes = parseInt(e.target.value)
    // }
    const handleDeleteList = async()=>{
        let res = await fetchUser(`/user/animelist/delete/${ani.anime_id}`,'DELETE').then(r=>r.json())
        alert(res.message);
        onClose()
        window.location.reload()
    }
    const handleRatingChange = (e:React.ChangeEvent<HTMLSelectElement>)=>{
        if(e.target.value !== 'none'){
            setRatingValue(e.target.value)
        }
    }
    return(
        <div className="edit-list-content">
            <button onClick={onClose} className="close-popup"><i className="fa-solid fa-x"></i></button>
            <div className="edit-list">
                <div style={{display: "flex"}}>
                    <button className="update-button" onClick={handleUpdateList}>Update Anime</button>
                    <button className="update-button" onClick={handleDeleteList}>Delete Anime</button>
                </div>
                <p>Editar Anime: {ani.name}</p>
                <div className="status">
                    <p>Status: </p>
                    <select value={status} onChange={(e) => {
                        handleChange(e, changeEnum.status)
                    }}>{Object.values(userAnimeState).map((v, i) => (
                        <option value={v} key={i}>{v}</option>
                    ))}</select>
                </div>
                <p>Rating</p>
                <select className="selectN" onChange={handleRatingChange} value={ratingValue}>
                    <option value="none">Selecione sua nota</option>
                    <option value="10">(10) Obra-prima</option>
                    <option value="9">(9) Incrivel</option>
                    <option value="8">(8) Muito Bom</option>
                    <option value="7">(7) Bom</option>
                    <option value="6">(6) Ok</option>
                    <option value="5">(5) Na Média</option>
                    <option value="4">(4) Ruim</option>
                    <option value="3">(3) Muito Ruim</option>
                    <option value="2">(2) Horrivel</option>
                    <option value="1">(1) Inassistível</option>
                </select>
                {/*<Rating setRatingValue={setRatingValue} ratingValue={ratingValue} aniId={ani.anime_id}/>*/}
                <div>
                    <div>
                        <p>Data de começo: </p>
                        {/* startDate?DateToStringLocal(startDate):"" */}
                        <input type="date" onChange={(e) => handleChange(e, changeEnum.startDate)}
                               value={startDate ? DateToStringInput(startDate) : ""}/>
                        <p>Data de fim: </p>
                        {/* endDate?DateToStringLocal(endDate):"" */}
                        <input type="date" onChange={(e) => handleChange(e, changeEnum.endDate)}
                               value={endDate ? DateToStringInput(endDate) : ""}></input>
                    </div>
                </div>
                {/* <p>Vezes asistido</p> */}
                {/* <input type="number" onChange={(e)=>handleChange(e,changeEnum.timesWatched)} value={timesWatched}></input> */}
                {

                }
                <div className="status">
                    <p>Prioridade: </p>
                    <select value={priority} onChange={(e) => handleChange(e, changeEnum.priority)}>
                        {Object.keys(priorityValue).map((v, i) => (
                            <option value={v}>{priorityValue[v as keyof typeof priorityValue]}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    )
}
export default AnimeEditList
