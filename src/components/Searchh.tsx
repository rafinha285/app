import React from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import LikeButton from "../assets/LikeButton";
import { trim } from "../features/main";
import "../css/index.css"
import "../css/base.css"
import "../css/search.css"
import { AnimeSearch } from "../types/Anime.ts";
import {cdnUrl} from "../const";

interface searchProp{
    ser:AnimeSearch
}

const Searchh:React.FC<searchProp> = ({ser}) =>{
    return(
        <Link to={`/Anime/${ser.id}`} className="search-item">
            <div className="search-img">
                <img src={`${cdnUrl}/ani/img?Id=${ser.id}`}></img>
            </div>
            <div className="search-prop">
                <h1>{ser.name}</h1>
                {/* <div className="search-stars">
                    <span><b style={{fontSize:"20px"}}>Nota:{ser.rating?ser.rating:0}/5</b><i style={{fontSize:"20px"}} className="fa-solid fa-star"></i></span>
                </div> */}
                {/* <LikeButton></LikeButton> */}
                <p>{trim(ser.description,450)}</p>
            </div>
        </Link>
    )
}
export default Searchh
