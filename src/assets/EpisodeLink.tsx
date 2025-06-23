import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Anime } from "../types/Anime";
import { Season } from "../types/Season";
import {Episode, EpisodeUser} from "../types/Episode";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDownload, faEye, faEyeSlash, faPlay} from "@fortawesome/free-solid-svg-icons";

import {fetchUser} from "../functions/userFunctions";
interface prop{
    ani:Anime,
    s:Season,
    ep:Episode,
    epList?:EpisodeUser
    handleWatched:()=>void,
    isLogged:boolean,
    // downloadHandle:()=>void
}
const EpisodeLink:React.FC<prop> = ({ani,s,ep,epList,handleWatched,isLogged})=>{
    const handleWatchedd =  async(e:React.MouseEvent) =>{
        if(isLogged){
            e.preventDefault()
            await fetchUser(`/ep/user/p/seen/${ani.id}/${s.id}/${ep.id}`,"POST")
            handleWatched()
        }
    }
    return(
        <>
            {ep?(
                <div className="ep" key={ep?.epindex}>
                    <span>{ep?.name}</span>
                    <div>
                        <button className={epList?"selected":""} onClick={!epList?handleWatchedd:()=>{}}><FontAwesomeIcon icon={epList?faEye:faEyeSlash}/> Visto</button>
                        <Link to={`/Anime/${ani.id}/watch/${s.id}/${ep.id}`}><button><FontAwesomeIcon icon={faPlay}/> Assistir</button></Link>
                        <Link to={`/Anime/${ani.id}/download/${s.id}/${ep.id}`}><button ><FontAwesomeIcon icon={faDownload}/> Download</button></Link>
                    </div>
                </div>
            ):(
                <></>
            )}
        </>
    )
}
export default EpisodeLink
