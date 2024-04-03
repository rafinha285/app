import React from "react";
import { Producer } from "../types/animeModel";
import { Link } from "react-router-dom";

export enum prodType{
    prod,
    crea,
    stud
}
interface props{
    prod:Producer,
    index:number,
    typee:prodType
}

const AniProducers:React.FC<props> = ({prod,index,typee}) =>{
    switch(typee){
        case prodType.prod:
            return(
                <Link to={`/prod/${prod.id}`} key={index}>
                    <div className="aniGenIn">
                        <p style={{margin:0}}>{prod.name}</p>
                    </div>
                </Link>
            )
        case prodType.crea:
            return(
                <Link to={`/crea/${prod.id}`} key={index}>
                    <div className="aniGenIn">
                        <p style={{margin:0}}>{prod.name}</p>
                    </div>
                </Link>
            )
        case prodType.stud:
            return(
                <Link to={`/stud/${prod.id}`} key={index}>
                    <div className="aniGenIn">
                        <p style={{margin:0}}>{prod.name}</p>
                    </div>
                </Link>
            )
    }
}
export default AniProducers