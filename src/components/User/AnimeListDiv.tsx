import React, { useEffect, useState } from "react";
import {Producer} from "../../types/types"
import { Anime, AnimeUser } from "../../types/Anime";
import { DateToStringLocal } from "../../features/main";
import Popup from "reactjs-popup";
import { cdnUrl } from "../../const";
import { Link } from "react-router-dom";
import AnimeEditList from "./AnimeEditList";


interface props{
    ani:AnimeUser
}
const AnimeListDiv:React.FC<props> =({ani})=>{
    interface aniProps{
        producers:Producer[],
        creators:Producer[],
        studios:Producer[],
    }
    const [aniProp,setAniProp] = useState<aniProps>()
    const [anime,setAnime] = useState<Anime>()
    const [isOpen,setIsOpen] = useState<boolean>()
    const handleEditAnime =()=>{

    }
    useEffect(()=>{
        const handleGetProps = async()=>{
            // const token = sessionStorage.getItem("token")
            // const headers:HeadersInit = {
            //     "Authorization":`Bearer ${token}`
            // }
            const getAnime:Anime = await fetch(`/ani/g/${ani.anime_id}`).then(res=>res.json())
            const getAnimeProps = await fetch(`/ani/g/prods/${ani.anime_id}`).then(async(response)=>await response.json())
            setAnime(getAnime)
            setAniProp(getAnimeProps)

        }
        handleGetProps()
    },[])
    return(
        <>
            <Popup open={isOpen} onClose={()=>setIsOpen(false)}>
                <AnimeEditList onClose={()=>setIsOpen(false)} ani={ani}/>
            </Popup>
            <div className="anime">
                <div className="anime-content">
                    <img src={`${cdnUrl}/ani/img?Id=${ani.anime_id}`}></img>
                    <Link to={`/Anime/${ani.anime_id}`}><p>{ani.name}</p></Link>
                    <button style={{margin:0}} className="addAnimeList" onClick={()=>setIsOpen(true)}>Editar anime</button>
                </div>
                <div className="anime-content">
                    <div className="anime-date">
                        <p>Data de começo: {DateToStringLocal(ani.start_date!)}</p>
                        <p>Data de Fim: {ani.finish_date?DateToStringLocal(ani.finish_date):"Não terminado ainda"}</p>
                    </div>
                </div>
                <div className="anime-content">
                    <div className="props">
                        <div className='genres prop'>
                            <p>Generos: </p>
                            <div className='prop-list'>
                                {anime?.genre.map((v,i)=>(
                                    <Link to={`/gen/${v}`}>
                                        <div className="prop-item" key={i}>{v}</div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <div className="studios prop">
                            <p>Estudios: </p>
                            <div className="prop-list">
                                {aniProp?.studios.map((v,i)=>(
                                    <Link to={`/stud/${v.id}`}>
                                        <div className="prop-item" key={i}>{v.name}</div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <div className="creators prop">
                            <p>Criadores: </p>
                            <div className="prop-list">
                                {aniProp?.creators.map((v,i)=>(
                                    <Link to={`/crea/${v.id}`}>
                                        <div className="prop-item" key={i}>{v.name}</div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                        {/* <div className="producers prop">
                            <p>Produtores: </p>
                            <div className="prop-list">
                                {aniProp?.producers.map((v,i)=>(
                                    <div className="prop-item" key={i}>{v.name}</div>
                                ))}
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
        </>
    )
}
export default AnimeListDiv
