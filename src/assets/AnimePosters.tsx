import React from "react";
import { Link } from "react-router-dom";
import {Anime} from "../types/animeModel";
import {getEpTime, trim} from "../features/main"
import "../css/index.css"
import '../css/base.css'
import {genToArray} from "../functions/animeFunctions"
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
    aniId: string;
    doc: Anime;
}

const AnimePoster:React.FC<AnimePosterProps> = ({aniId,doc})=>{
    console.log(doc.genre)
    console.log(doc)
    return(
        <Link to={`/Anime/${aniId}`}>
            <article className="newanime-t">
                <div className="highlight-hover" />
                <div className="highlight-img">
                    <img src={`${cdnUrl}/ani/img?Id=${aniId}`} alt={doc!.name}></img>
                </div>
                <div className="highlight-body">
                    <div className="highlight-time">
                        <span>{getEpTime(doc.averageeptime!)}</span>
                        <FontAwesomeIcon icon={faClock}/>
                    </div>
                    <div className="highlight-genres">{gen(doc.genre)}</div>
                    <div className="highlight-title">{doc.name}</div>
                    <div className="highlight-desc">{trim(doc.description)}</div>
                </div>
            </article>
        </Link>
    )
}

export default AnimePoster
