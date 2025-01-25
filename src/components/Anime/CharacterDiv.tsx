import React from "react"
import PersoCompo from "../Perso";
import {Character} from "../../types/Character";

interface Props{
    characters:Character[];
    aniId:string;
}

const CharacterDiv:React.FC<Props> = ({characters,aniId}) =>{
    return (
        <div className="personagens">
            <div style={{display: "flex", justifyContent: "space-between", marginBottom: "1em"}}>
                <h1>Personagens: </h1>
            </div>
            <div style={{
                border: "1px white solid",
                padding: "1em",
                display: "flex",
                flexWrap: "nowrap",
                justifyContent: "flex-start",
                flexDirection: 'row',
                overflow: "auto"
            }}>{characters.map((v, i) => (
                <PersoCompo perso={v} aniId={aniId} key={i}></PersoCompo>
            ))}</div>
        </div>
    )
}
export default CharacterDiv
