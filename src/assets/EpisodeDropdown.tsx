import React from "react";
import { Link } from "react-router-dom";

interface prop{
    aniId:string;
    seasonId:string;
    epId:string;
    epNId:string
    epNom:string;
}
const EpisodeDropdown:React.FC<prop> =({aniId,seasonId,epId,epNom,epNId})=>{
    if(epId === epNId){
        return(
        <a style={{backgroundColor:"var(--light_blue2)"}} href={`/Anime/${aniId}/watch/${seasonId}/${epId}`}>
            <span>{epNom}</span>
        </a>
    )
    }else{
        return(
        <a href={`/Anime/${aniId}/watch/${seasonId}/${epId}`}>
            <span>{epNom}</span>
        </a>
    )
    }
}
export default EpisodeDropdown