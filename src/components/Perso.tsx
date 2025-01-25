import React from "react";
import "../css/perso.css"
import {cdnUrl} from "../const";
import {Character} from "../types/Character";


interface props{
    perso:Character
    aniId:string
}
const PersoCompo:React.FC<props> = ({perso,aniId}) =>{
    return(
        <div className="perso-div">
            <div className="perso-div-hover"/>
            <div className="perso-div-body">
                <p>{perso.name}</p>
                <p>Papel: {perso.role}</p>
            </div>
            <img src={`${cdnUrl}/char/${aniId}/${perso.id}/img`} className="perso-div-img"></img>

        </div>
    )
}
export default PersoCompo
