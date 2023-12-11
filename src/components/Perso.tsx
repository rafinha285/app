import React from "react";
import { character } from "../types/characterModel";
import "../css/perso.css"


interface props{
    perso:character
}
const PersoCompo:React.FC<props> = ({perso}) =>{
    return(
        <div className="perso-div">
            <div className="perso-div-hover"/>
            <div className="perso-div-img">
                <img src={``}></img>
            </div>
        </div>
    )
}
export default PersoCompo