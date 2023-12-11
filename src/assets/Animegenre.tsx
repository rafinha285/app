import React, {useState} from "react";
import { Link } from "react-router-dom";

interface AniGenProps{
    genres:string[]
}

const AniGeneros:React.FC<AniGenProps> = ({genres}) =>{
    return(
        <>
            {genres.map((genre,index)=>(
                <Link to={`/gen/${genre}`} key={index}>
                    <div className="aniGenIn">
                        <p style={{margin:0}}>{genre}</p>
                    </div>
                </Link>
            ))}
        </>
    )
}
export default AniGeneros