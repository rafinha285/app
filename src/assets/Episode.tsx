import React from "react";
import "../css/episodes.css"
import { getEpTime } from "../features/main";
import { Link } from "react-router-dom";
import { EpisodeSim } from "../types/episodeModel";
import {cdnUrl} from "../const";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faClock} from "@fortawesome/free-regular-svg-icons";

interface props{
    ep:EpisodeSim
}
const Episode:React.FC<props> = ({ep}) =>{

    // console.log(ep,`/api/ep/${ep.anime}/${ep.season}/${ep.ep}/${ep.ep}.jpg`)
    console.log(ep)
    return(
        <Link className="episodes-link" to={`/Anime/${ep.anime_id}/watch/${ep.season_id}/${ep.id}`}>
            <div className="">
                <div className="ep-hover"/>
                <div className="ep-img">
                    <img alt={ep.animename} src={`${cdnUrl}/epPOster/${ep.anime_id}/${ep.season_id}/${ep.id}`}></img>
                </div>
                <div className="ep-body">
                    <div className="ep-res">
                        <div className="ep-res-in">{ep.resolution[0].split("x")[1].concat("p").toUpperCase()}</div>
                    </div>
                    <div className="ep-time">
                        <span datatype={ep.id}>{getEpTime(ep.duration)}</span>
                        <FontAwesomeIcon icon={faClock}/>
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
