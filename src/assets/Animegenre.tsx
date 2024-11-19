import React, {useState} from "react";
import { Link } from "react-router-dom";
import { genToArray } from "../functions/animeFunctions";

interface AniGenProps{
    genre:string;
    index:number
}

const AniGeneros:React.FC<AniGenProps> = ({genre,index}) =>{
    // console.log(genre);
    
    return(
        <>
            <Link to={`/gen/${genre}`} key={index}>
                <div className="aniGenIn">
                    <p style={{margin:0}}>{genre}</p>
                </div>
            </Link>
        </>
    )
}
export default AniGeneros