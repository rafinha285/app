import React from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import {animeType,animeTypeSearch,Episode,} from "../types/AnimeType";
import LikeButton from "../assets/LikeButton";
import { trim } from "../features/main";
import "../css/index.css"
import "../css/base.css"
import "../css/search.css"

interface searchProp{
    ser:animeType | animeTypeSearch
}

const Searchh:React.FC<searchProp> = ({ser}) =>{
    const serr = (ser as animeType)
    const desc = serr.content? serr.content.Desc:(ser as animeTypeSearch).Desc
    return( 
        <Link to={`/Anime/${ser._id}`} className="search-item">
            <div className="search-img">
                <img src={`/api/ani/img?Id=${ser._id}`}></img>
            </div>
            <div className="search-prop">
                <h1>{ser.Nom}</h1>
                <div className="search-stars">
                    <span><b style={{fontSize:"20px"}}>Nota:5/5</b><i style={{fontSize:"20px"}} className="fa-solid fa-star"></i></span>
                </div>
                {/* <LikeButton></LikeButton> */}
                <p>{trim(desc,450)}</p>
            </div>
        </Link>
    )
}
export default Searchh