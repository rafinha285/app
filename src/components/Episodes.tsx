import React, { useEffect, useState } from "react";
import "../css/episodes.css"
import EpisodeComponent from "../assets/EpisodeComponent";
import { Link } from "react-router-dom";
import {EpisodeDTO} from "../types/Episode";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {apiUrl} from "../const";
import axios from "axios";

interface prop{
    count:number|undefined
}
const Episodes:React.FC<prop> = ({count}) =>{
    const [eps,setEps] = useState<EpisodeDTO[]>()
    useEffect(()=>{
        if(count){
            let request = axios.get(`${apiUrl}/g/episode/all?count=${count}`)

        }else{
            fetch(`${apiUrl}/g/episode/all`).then(async(res)=>{
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
                    <EpisodeComponent ep={v}></EpisodeComponent>
                ))}
            </div>
        </div>
    )
}
export default Episodes
