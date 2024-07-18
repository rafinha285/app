// import Plyr from "plyr";
import React, {useCallback, useEffect, useRef, useState} from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import Player from "../components/Player";
import { Episode} from "../types/episodeModel";
import { Anime } from "../types/animeModel";
import "../css/watch.css"
import { Link } from "react-router-dom";
import LikeButton from "../assets/LikeButton";
import Footer from "../components/Footer";
import Header from "../components/Header";
import EpisodeDropdown from "../assets/EpisodeDropdown";
import { Log } from "../types/logType";
import { DateToStringLocal, nextEpUrl, prevEpUrl } from "../features/main";
import { getEpsFromSeason ,tupleToSeason} from "../functions/animeFunctions";
import Loading from "../components/Loading";
import { cdnUrl } from "../const";




const Watch:React.FC = () =>{

    const {id,epId} = useParams()
    const seasonId = window.location.href.split("/")[6]
    const [ep,setEp] = useState<Episode|null>(null)
    const [ani,setAni]= useState<Anime>()
    // const [epIndex,setEpIndex] = useState<number>(1)
    const [eps,setEps] = useState<Episode[]>()
    const [nextUrl,setNextUrl] = useState<string>()
    const [prevUrl,setPrevUrl] = useState<string>()
    const [epsMap,setEpsMap] = useState<Map<number, Episode>>(new Map())
    const fetchEps = useCallback(async(ani:Anime,ep:Episode) =>{
        var res = await fetch(`/api/g/s/eps/${ani.id}/${ep?.seasonid}`)
        let data = await res.json()
        let epsMapTemp = new Map<number, Episode>();
        for(let i =0 ;i<data.length;i++){
            epsMapTemp.set(data[i].epindex, data[i]);
        }
        setEpsMap(epsMapTemp);
        setEps(data)
    },[!eps])
    // var prevEp = ""
    // const [prevEp,setPrevEp] = useState<string>("")
    const isFirstEp = (eps:Episode[]):boolean =>{
        if(Math.min(...eps.map(v=>v.epindex))===ep?.epindex){
            return true
        }else{
            return false
        }
    }
    const isLastEp = (eps:Episode[]):boolean =>{
        if(Math.max(...eps.map(v=>v.epindex))===ep?.epindex){
            return true
        }else{
            return false
        }
    }
    var nextEp:Episode|null
    useEffect(()=>{
        $.ajax({
            url:`/api/g/eps/${id}/${seasonId}/${epId}`
        }).done((res)=>{
            console.log(res)
            setEp(res)
            console.log(ani)
            // setEpIndex(tupleToSeason(ani!.seasons!).find(e=>e.id == seasonId)?.episodes.findIndex(e=>e===ep?.id)!)

        })

        $.ajax({
            url:`/api/ani/${id}`
        }).done((res)=>{
            setAni(res)
            if(ani&&ep){
                // console.log(nextEpUrl(eps!,ani.id,ep))
                console.log(ani,ani.id)
                fetchEps(ani,ep)
                .catch(console.error)
                .then(()=>{
                    if(eps&&ep){
                        // console.log(id,ani?._id,seasonId,epIndex,ani)
                        // console.log(ep)

                        // console.log(`/Anime/${ani?._id}/watch/${seasonId}/${ani?.seasons?.find(s=>s._id == seasonId)?.episodes[epIndex-1]._id}`)
                        // if(Math.min())
                        // $("#before").attr("href",`/Anime/${ani?._id}/watch/${seasonId}/${ani?.seasons?.find(s=>s._id == seasonId)?.episodes[epIndex-1]._id}`)
                        // $("#after").attr("href",`/Anime/${ani?._id}/watch/${seasonId}/${ani?.seasons?.find(s=>s._id == seasonId)?.episodes[ep?.index!+1]._id!}`)
                        // if()

                        setNextUrl(nextEpUrl(eps,ani.id,ep))
                        setPrevUrl(prevEpUrl(eps,ani.id,ep))
                        console.log(`/Anime/${ani.id}/watch/${ep?.seasonid}/${eps.find(v=>v.epindex === (ep.epindex+1))!.id}`)
                    }
                })
            }

        })

        $("#linkAnime").css("margin","2em auto 7em auto")
        // console.log(`/Anime/${ani!._id}/watch/${seasonId!}/${ani?.seasons?.find(s=>s._id==seasonId)!._id}`)
    },[!ani,fetch])
    const handleChangeClass = (e:React.MouseEvent) =>{
        e.preventDefault()
        $("#epSelDrop").toggleClass("ep-sel-show")
    }




    const nextEpHandle = (e:React.MouseEvent) =>{
        e.preventDefault();
        console.log("nextEpHandle", epsMap)
        if(epsMap.has(ep?.epindex!+1)){
            window.location.href = `/Anime/${ani?.id}/watch/${ep?.seasonid}/${epsMap.get(ep?.epindex! + 1)!.id}`
        }
    }
    const prevEpHandle = (e:React.MouseEvent) =>{
        e.preventDefault();
        if(epsMap.has(ep?.epindex!-1)){
            window.location.href = `/Anime/${ani?.id}/watch/${ep?.seasonid}/${epsMap.get(ep?.epindex! - 1)!.id}`
        }
    }
    // $("#after").on("click",()=>handleNextEp(ani?.id!,seasonId,eps!,ep?.epindex!))
    return(
        <>
            {ani&&eps?(
                <html lang="pt-BR">
                <Helmet>
                    <title>Assistir: {ani.name}, {ep?.name}</title>
                </Helmet>
                <Header></Header>
                <Link style={{width:"fit-content",margin:"3em auto"}} to={`/Anime/${id}`} id="linkAnime">
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
                            <img src={`${cdnUrl}/ani/img?Id=${ani?.id}`} alt={ani?.name}></img>
                        </div>
                    </div>
                </Link>
                {ep&&ani&&seasonId?<Player ep={ep} ani={ani} seasonId={seasonId} eps={eps}/>:<></>}
                <div className="ep-sel1">
                    <div>
                        <p>Nome Episódio: <span>{ep?.name}</span></p>
                        <p>Data de Lançamento <span>{DateToStringLocal(new Date(ep?.releasedate!))}</span></p>
                    </div>
                    <div className="ep-select">
                        <div style={{display:"flex",alignItems:"center",justifyContent:"center"}}>

                            <button className="ep-sel-but" onClick={prevEpHandle} disabled={isFirstEp(eps)}>
                                <i className="fa-solid fa-arrow-left"></i>
                            </button>

                            <button className="ep-sel-but" onClick={handleChangeClass}>
                                <i className="fa-solid fa-bars"></i>
                            </button>

                            <button className="ep-sel-but" onClick={nextEpHandle} disabled={isLastEp(eps)}>
                                <i className="fa-solid fa-arrow-right"></i>
                            </button>

                        </div>
                        <div>
                            <div id="epSelDrop" className="ep-sel-dropdown">
                                <div className="inEps">
                                    {eps.sort((a,b)=>a.epindex-b.epindex).map((e)=>(
                                        <EpisodeDropdown epId={e.id} epNom={e.name} aniId={ani.id} seasonId={seasonId!} epNId={ep?.id!} key={e.epindex}></EpisodeDropdown>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer></Footer>
            </html>
            ):(
                <Loading/>
            )}
        </>
    )
}

export default Watch
