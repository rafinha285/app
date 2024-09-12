import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Anime } from "../types/animeModel";
import { Season } from "../types/animeModel";
import { Episode } from "../types/episodeModel";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDownload, faPlay} from "@fortawesome/free-solid-svg-icons";
interface prop{
    ani:Anime,
    s:Season,
    ep:Episode,
    // downloadHandle:()=>void
}
const EpisodeLink:React.FC<prop> = ({ani,s,ep})=>{
    // const [episode,setEpisode] = useState<Episode>()
    // useEffect(()=>{

    // },[!episode])
    return(
        <>
            {ep?(
                <div className="ep" key={ep?.epindex}>
                    <span>{ep?.name}</span>
                    <div>
                        <button><i className="far fa-eye"></i> Visto</button>
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
