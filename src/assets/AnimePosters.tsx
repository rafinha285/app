import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import mongoose,{ObjectId} from "mongoose"
import {Anime,AnimeDocument} from "../types/animeModel";
import {getEpTime, trim} from "../features/main"
import "../css/index.css"
import '../css/base.css'





function gen(arr:string[]):JSX.Element[]{
    var elements:JSX.Element[] = []
    for(let i = 0;i<arr.length;i++){
        elements.push(<span key={i}>{arr[i]}</span>)
    }
    return elements
}

interface AnimePosterProps {
    aniId: string;
    doc: AnimeDocument|Anime|undefined;
}

const AnimePoster:React.FC<AnimePosterProps> = ({aniId,doc})=>{
    console.log(doc)
    return(
        <Link to={`/Anime/${aniId}`}>
            <article className="newanime-t">
                <div className="highlight-hover" />
                <div className="highlight-img">
                    <img src={`/api/ani/img?Id=${aniId}`} alt={doc!.name}></img>
                </div>
                <div className="highlight-body">
                    <div className="highlight-time">
                        <span>{getEpTime(doc!.averageEptime!)}</span>
                        <i className="fa-solid fa-clock"></i>
                    </div>
                    <div className="highlight-genres">{gen(doc!.generos)}</div>
                    <div className="highlight-title">{doc!.name}</div>
                    <div className="highlight-desc">{trim(doc!.description)}</div>
                </div>
            </article>
        </Link>
    )
}

export default AnimePoster