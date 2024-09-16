import React, { useEffect, useState } from "react";
import "../css/episodes.css"
import { epLog } from "../types/logType";
import Episode from "../assets/Episode";
import { Link } from "react-router-dom";
import {EpisodeSim} from "../types/episodeModel";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";

interface prop{
    count:number|undefined
}
const Episodes:React.FC<prop> = ({count}) =>{
    const [eps,setEps] = useState<EpisodeSim[]>()
    useEffect(()=>{
        if(count){
            fetch(`/ep/g/lan?count=${count}`).then(async(res)=>{
                setEps(await res.json())
            })
        }else{
            fetch(`/ep/g/lan`).then(async(res)=>{
                setEps(await res.json())
            })
        }

    },[!eps])
    return(
        <div className="episodes">
            <div style={{display:"flex",justifyContent:"space-between"}}>
                <h2>Episódios recem-adicionados</h2>
                <Link className="newMoreBut" to={`/Anime/lancamentos`}>
                    <span className="ui-icon-plusthic"></span>
                    <FontAwesomeIcon icon={faPlus}/>
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
