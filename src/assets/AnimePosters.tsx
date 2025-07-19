import React from "react";
import { Link } from "react-router-dom";
import {Anime} from "../types/Anime";
import {getEpTime, trim} from "../functions/stringFunctions"
import "../css/index.css"
import '../css/base.css'
import {cdnUrl} from "../const";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faClock} from "@fortawesome/free-regular-svg-icons";

function gen(arr:string[]):JSX.Element[]{
    var elements:JSX.Element[] = []
    for(let i = 0;i<arr.length;i++){
        elements.push(<span key={i}>{arr[i]}</span>)
    }
    return elements
}

interface AnimePosterProps {
    anime: Anime;
}

const AnimePoster:React.FC<AnimePosterProps> = ({anime})=>{
    console.log(anime.genre)
    console.log(anime)
    return(
        <Link to={`/Anime/${anime.id}`}>
            <article className="newanime-t">
                <div className="highlight-hover" />
                <div className="highlight-img">
                    <img src={`${cdnUrl}/ani/img/${anime.id}/${anime.id}.jpg`} alt={anime!.name}></img>
                </div>
                <div className="highlight-body">
                    <div className="highlight-time">
                        <span>{getEpTime(anime.averageEpTime!)}</span>
                        <FontAwesomeIcon icon={faClock}/>
                    </div>
                    <div className="highlight-genres">{gen(anime.genre)}</div>
                    <div className="highlight-title">{anime.name}</div>
                    <div className="highlight-desc">{trim(anime.description)}</div>
                </div>
            </article>
        </Link>
    )
}

export default AnimePoster
