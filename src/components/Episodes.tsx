import React, { useEffect, useState } from "react";
import "../css/episodes.css"
import { epLog } from "../types/logType";
import Episode from "../assets/Episode";
import { Link } from "react-router-dom";
import {EpisodeSim} from "../types/episodeModel.ts";

interface prop{
    count:number|undefined
}
const Episodes:React.FC<prop> = ({count}) =>{
    const [eps,setEps] = useState<EpisodeSim[]>()
    useEffect(()=>{
        if(count){
            $.ajax({
                method:"GET",
                url:`/api/g/eps?count=${count}`
            }).done((res)=>{
                setEps(res)
            })
        }else{
            $.ajax({
                method:"GET",
                url:`/api/g/eps`
            }).done((res)=>{
                setEps(res)
            })
        }

    },[!eps])
    return(
        <div className="episodes">
            <div style={{display:"flex",justifyContent:"space-between"}}>
                <h2>Episódios recem-adicionados</h2>
                <Link className="newMoreBut" to={`/Anime/lancamentos`}>
                    <span className="ui-icon-plusthic"></span>
                    <i className="fa-solid fa-plus"></i>
                    Ver mais
                </Link>
            </div>
            <div style={{display:"flex",padding:"1em",flexWrap:"wrap"}}>
                {eps?.map((v,i)=>(
                    <Episode ep={v}></Episode>
                ))}
            </div>
        </div>
    )
}
export default Episodes
