import React from "react";
import { character } from "../types/characterModel";
import "../css/perso.css"


interface props{
    perso:character
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
            <img src={`/api/ani/char/${aniId}/${perso._id}/img`} className="perso-div-img"></img>
            
        </div>
    )
}
export default PersoCompo