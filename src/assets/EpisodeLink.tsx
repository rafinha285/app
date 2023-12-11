import React from "react";
import { Link } from "react-router-dom";
import { AnimeDocument } from "../types/animeModel";
import { Season } from "../types/seasonModel";
import { Episode } from "../types/episodeModel";
interface prop{
    ani:AnimeDocument,
    s:Season,
    ep:Episode,
    downloadHandle:()=>void
}
const EpisodeLink:React.FC<prop> = ({ani,s,ep,downloadHandle})=>{
    return(
        <div className="ep">
            <span>{ep.name}</span>
            <div>
                <button><i className="far fa-eye"></i> Visto</button>
                <Link to={`/Anime/${ani?._id}/watch/${s._id}/${ep._id}`}><button><i className="fa-solid fa-play"></i> Assistir</button></Link>
                <button onClick={downloadHandle}><i className="fa-solid fa-download"></i> Download</button>
            </div>
        </div>
    )
}
export default EpisodeLink