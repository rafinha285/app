import React from "react";
import { Link } from "react-router-dom";
import { AnimeAgenda } from "../../types/animeModel";
import { trim } from "../../features/main";
import {cdnUrl} from "../../const";

interface props{
    ani:AnimeAgenda
}

const AgendComponent:React.FC<props> = ({ani}) =>{
    return(
        <Link to={`/Anime/${ani.id}`} className="search-item">
            <div className="search-img">
                <img src={`${cdnUrl}/ani/img?Id=${ani.id}`}/>
            </div>
            <div className='search-prop'>
                <h1>{ani.name}</h1>
                <div className="search-stars">
                    <span><b style={{fontSize:"20px"}}>Nota:{ani.rating?ani.rating:0}</b><i style={{fontSize:'20px'}} className='fa-solid fa-star'/></span>
                </div>
                <p>{trim(ani.description,450)}</p>

            </div>
            <div style={{float:"right"}}>
                <h2>Lançamento toda:</h2><br/>
                <p>{ani.weekday}</p>
            </div>
        </Link>
    )
}
export default AgendComponent
