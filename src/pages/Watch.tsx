import Plyr, { APITypes } from "plyr-react";
import React, {useEffect, useRef, useState} from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import Player from "../components/Player";
import { Episode, EpisodeDocument } from "../types/episodeModel";
import { AnimeDocument } from "../types/animeModel";
import "../css/watch.css"
import { Link } from "react-router-dom";
import LikeButton from "../assets/LikeButton";
import Footer from "../components/Footer";
import Header from "../components/Header";
import EpisodeDropdown from "../assets/EpisodeDropdown";
import { Log } from "../types/logType";
import { NextEp, handleNextEp } from "../features/main";




const Watch:React.FC = () =>{
    
    const {id,epId} = useParams()
    const seasonId = window.location.href.split("/")[6]
    const [ep,setEp] = useState<Episode|null>(null)
    const [ani,setAni]= useState<AnimeDocument>()
    const [epIndex,setEpIndex] = useState<number>(1)
    // var prevEp = ""
    // const [prevEp,setPrevEp] = useState<string>("")
    var nextEp:Episode|null
    useEffect(()=>{
        $.ajax({
            url:`/api/g/ep/${id}/${seasonId}/${epId}`
        }).done((res)=>{
            console.log(res)
            setEp(res)
            setEpIndex(ani?.seasons?.find(e=>e._id == seasonId)?.episodes.findIndex(e=>e._id==ep?._id)!)
        })
        $.ajax({
            url:`/api/ani/${id}`
        }).done((res)=>{
            setAni(res)
            if(ani){
                // console.log(id,ani?._id,seasonId,epIndex,ani)
                // console.log(ep)
                
                // console.log(`/Anime/${ani?._id}/watch/${seasonId}/${ani?.seasons?.find(s=>s._id == seasonId)?.episodes[epIndex-1]._id}`)
                // if(Math.min())
                // $("#before").attr("href",`/Anime/${ani?._id}/watch/${seasonId}/${ani?.seasons?.find(s=>s._id == seasonId)?.episodes[epIndex-1]._id}`)
                // $("#after").attr("href",`/Anime/${ani?._id}/watch/${seasonId}/${ani?.seasons?.find(s=>s._id == seasonId)?.episodes[ep?.index!+1]._id!}`)
            }
        })
        $("#linkAnime").css("margin","2em auto 7em auto")
        // console.log(`/Anime/${ani!._id}/watch/${seasonId!}/${ani?.seasons?.find(s=>s._id==seasonId)!._id}`)
    },[!ani])
    const handleChangeClass = (e:React.MouseEvent) =>{
        e.preventDefault()
        $("#epSelDrop").toggleClass("ep-sel-show")
    }
    return(
        
        <html lang="pt-BR">
            <Helmet>
                <title>Assistir:{} {ep?.name}</title>
            </Helmet>
            <Header></Header>
            <Link to={`/Anime/${id}`} id="linkAnime">
                <div className="card">
                    <div className="card-hover">
                        <div>
                            <span>{ani?.name}</span><br/>
                            <span className="epSpan">{ep?.name}</span>
                        </div>
                        <div className="card-content-l">
                            <div style={{margin:"auto"}}>
                                <i className="fa-regular fa-star" data-rating="1"></i>
                                <i className="fa-regular fa-star" data-rating="2"></i>
                                <i className="fa-regular fa-star" data-rating="3"></i>
                                <i className="fa-regular fa-star" data-rating="4"></i>
                                <i className="fa-regular fa-star" data-rating="5"></i>
                            </div>
                            <LikeButton></LikeButton>
                        </div>
                    </div>
                    <div className="card-img">
                        <img src={`/api/ani/img?Id=${ani?._id}`} alt={ani?.name}></img>
                    </div>
                </div>
            </Link>
            {ep&&ani&&seasonId?<Player ep={ep} ani={ani} seasonId={seasonId}/>:<></>}
            <div className="ep-sel1">
                <div>
                    <p>Nome Episódio: <span>{ep?.rating}</span></p>
                </div>
                <div className="ep-select">
                    <div style={{display:"flex",alignItems:"center",justifyContent:"center"}}>
                        <a id="before">
                            <button className="ep-sel-but">
                                <i className="fa-solid fa-arrow-left"></i>
                            </button>
                        </a>
                        <button className="ep-sel-but" onClick={handleChangeClass}>
                            <i className="fa-solid fa-bars"></i>
                        </button>
                        <a id="after" onClick={()=>nextEp?handleNextEp(ani!,seasonId,ep!):null} aria-disabled={nextEp?true:false}>
                        {/* href={`/Anime/${ani?._id}/watch/${seasonId}/${ani?.seasons?.find(s=>s._id===seasonId)?.episodes[ep?.index!+1]._id}`} */}
                            <button className="ep-sel-but">
                                <i className="fa-solid fa-arrow-right"></i>
                            </button>
                        </a>
                    </div>
                    <div>
                        <div id="epSelDrop" className="ep-sel-dropdown">
                            <div className="inEps">
                                {ani?.seasons?.find(s=>s._id===seasonId)?.episodes.map((e)=>(
                                    <EpisodeDropdown epId={e._id} epNom={e.name} aniId={ani._id} seasonId={seasonId!} epNId={ep?._id!}></EpisodeDropdown>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer></Footer>
        </html>
    )
}

export default Watch