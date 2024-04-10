import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Anime } from "../types/animeModel";
import { Season } from "../types/animeModel";
import { Episode } from "../types/episodeModel";
interface prop{
    ani:Anime,
    s:Season,
    ep:Episode,
    // downloadHandle:()=>void
}
const EpisodeLink:React.FC<prop> = ({ani,s,ep})=>{
    // const [episode,setEpisode] = useState<Episode>()
    // useEffect(()=>{
    //     $.ajax({
    //         url:`/api/g/eps/${ani.id}/${s.id}/${(ep as Episode).id||(ep as string)}`
    //     }).done((res:Episode)=>{
    //         setEpisode(res)
    //     })
    // },[!episode])
    return(
        <>
            {ep?(
                <div className="ep" key={ep.epindex}>
                    <span>{ep.name}</span>
                    <div>
                        <button><i className="far fa-eye"></i> Visto</button>
                        <Link to={`/Anime/${ani.id}/watch/${s.id}/${ep.id}`}><button><i className="fa-solid fa-play"></i> Assistir</button></Link>
                        <Link to={`/Anime/${ani.id}/download/${s.id}/${ep.id}`}><button ><i className="fa-solid fa-download"></i> Download</button></Link>
                    </div>
                </div>
            ):(
                <></>
            )}
        </>
    )
}
export default EpisodeLink