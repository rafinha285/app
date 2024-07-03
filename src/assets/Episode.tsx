import React from "react";
import "../css/episodes.css"
// import { epLog } from "../types/logType";
import { getEpTime } from "../features/main";
import { Link } from "react-router-dom";
import { EpisodeSim } from "../types/episodeModel";
import {cdnUrl} from "../const";

interface props{
    ep:EpisodeSim
}
const Episode:React.FC<props> = ({ep}) =>{

    // console.log(ep,`/api/ep/${ep.anime}/${ep.season}/${ep.ep}/${ep.ep}.jpg`)
    console.log(ep)
    return(
        <Link className="episodes-link" to={`/Anime/${ep.animeid}/watch/${ep.seasonid}/${ep.id}`}>
            <div className="">
                <div className="ep-hover"/>
                <div className="ep-img">
                    <img alt={ep.animename} src={`${cdnUrl}/ep/${ep.animeid}/${ep.seasonid}/${ep.id}/${ep.id}.jpg`}></img>
                </div>
                <div className="ep-body">
                    <div className="ep-res">
                        <div className="ep-res-in">{ep.resolution[0].split("x")[1].concat("p").toUpperCase()}</div>
                    </div>
                    <div className="ep-time">
                        <span datatype={ep.id}>{getEpTime(ep.duration)}</span>
                        <i datatype={ep.id} className="far fa-clock"></i>
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
