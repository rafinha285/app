import React from "react";
import "../css/episodes.css"
import { getEpTime } from "../functions/stringFunctions";
import { Link } from "react-router-dom";
import {cdnUrl} from "../const";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faClock} from "@fortawesome/free-regular-svg-icons";
import {EpisodeDTO} from "../types/Episode";

interface props{
    ep:EpisodeDTO
}
const EpisodeComponent:React.FC<props> = ({ep}) =>{

    // console.log(ep,`/api/ep/${ep.anime}/${ep.season}/${ep.ep}/${ep.ep}.jpg`)
    console.log(ep)
    return(
        <Link className="episodes-link" to={`/Anime/${ep.animeId}/watch/${ep.seasonId}/${ep.id}`}>
            <div className="">
                <div className="ep-hover"/>
                <div className="ep-img">
                    <img alt={""} src={`${cdnUrl}/epPoster/${ep.animeId}/${ep.seasonId}/${ep.id}`}></img>
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
                    {ep.animeTitle}
                    </div>
                    <div className="ep-animeseason">
                        {ep.seasonTitle}
                    </div>
                    <div className="ep-title">
                    {ep.name}
                    </div>
                </div>
            </div>
        </Link>
    )
}
export default EpisodeComponent
