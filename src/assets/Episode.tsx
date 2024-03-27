import React from "react";
import "../css/episodes.css"
import { epLog } from "../types/logType";
import { getEpTime } from "../features/main";
import { Link } from "react-router-dom";

interface props{
    ep:epLog
}
const Episode:React.FC<props> = ({ep}) =>{

    // console.log(ep,`/api/ep/${ep.anime}/${ep.season}/${ep.ep}/${ep.ep}.jpg`)
    console.log(ep.seasonname)
    return(
        <Link className="episodes-link" to={`/Anime/${ep.anime}/watch/${ep.season}/${ep.ep}`}>
            <div className="">
                <div className="ep-hover"/>
                <div className="ep-img">
                    <img alt={ep.animename} src={`/api/ep/${ep.anime}/${ep.season}/${ep.ep}/${ep.ep}.jpg`}></img>
                </div>
                <div className="ep-body">
                    <div className="ep-res">
                        <div className="ep-res-in">{ep.resolution.toUpperCase()}</div>
                    </div>
                    <div className="ep-time">
                        <span datatype={ep.ep}>{getEpTime(ep.duration)}</span>
                        <i datatype={ep.ep} className="far fa-clock"></i>
                    </div>
                    <div className="ep-animetitle">
                    {ep.animename}
                    </div>
                    <div className="ep-animeseason">
                        {ep.seasonname}
                    </div>
                    <div className="ep-title">
                    {ep.name}
                    </div>
                </div>
            </div>
        </Link>
    )
}
export default Episode