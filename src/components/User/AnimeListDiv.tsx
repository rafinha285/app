import React, { useEffect, useState } from "react";
import { AnimeUser, Producer } from "../../types/animeModel";
import { DateToStringLocal } from "../../features/main";
import { tupleToProducer } from "../../functions/animeFunctions";


interface props{
    ani:AnimeUser
}
const AnimeListDiv:React.FC<props> =({ani})=>{
    interface aniProps{
        producers:Producer[],
        creators:Producer[],
        studios:Producer[],
        genre:string[]
    }
    const [aniProp,setAniProp] = useState<aniProps>()
    useEffect(()=>{
        const handleGetProps = async()=>{
            const token = sessionStorage.getItem("token")
            const headers:HeadersInit = {
                "Authorization":`Bearer ${token}`
            }
            const getAnimeProps = await fetch(`/api/ani/${ani.anime_id}/props`,headers)
                .then(async(response)=>await response.json())
            var props:aniProps = {
                producers:tupleToProducer(getAnimeProps.producers),
                creators:tupleToProducer(getAnimeProps.creators),
                studios:tupleToProducer(getAnimeProps.studios),
                genre:getAnimeProps.genre
            }
            setAniProp(props)

        }
        handleGetProps()
    },[])
    return(
        <div className="anime">
            <div className="anime-content">
                <img src={`/api/ani/img?Id=${ani.anime_id}`}></img>
                <p>{ani.name}</p>
            </div>
            <div className="anime-content">
                <div className="anime-date">
                    <p>Data de começo: {DateToStringLocal(ani.start_date)}</p>
                    <p>Data de Fim: {ani.finish_date?DateToStringLocal(ani.finish_date):"Não terminado ainda"}</p>
                </div>
            </div>
            <div className="anime-content">
                <div className="props">
                    <div className='genres prop'>
                        <p>Generos: </p>
                        <div className='prop-list'>
                            {aniProp?.genre.map((v,i)=>(
                                <div className="prop-item" key={i}>{v}</div>
                            ))}
                        </div>
                    </div>
                    <div className="studios prop">
                        <p>Estudios: </p>
                        <div className="prop-list">
                            {aniProp?.studios.map((v,i)=>(
                                <div className="prop-item" key={i}>{v.name}</div>
                            ))}
                        </div>
                    </div>
                    <div className="creators prop">
                        <p>Criadores: </p>
                        <div className="prop-list">
                            {aniProp?.creators.map((v,i)=>(
                                <div className="prop-item" key={i}>{v.name}</div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default AnimeListDiv