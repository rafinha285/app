import React, {useCallback, useEffect, useRef, useState} from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import {Episode, EpisodeUser} from "../types/episodeModel";
import { Anime } from "../types/animeModel";
import "../css/watch.css"
import { Link } from "react-router-dom";
import LikeButton from "../assets/LikeButton";
import Footer from "../components/Footer";
import Header from "../components/Header";
import EpisodeDropdown from "../assets/EpisodeDropdown";
import {DateToStringLocal, fetchUser} from "../features/main";
import Loading from "../components/Loading";
import { cdnUrl } from "../const";
import Comments from "../components/CommentsDisqus.tsx";
import {isFirstEp, isLastEp} from "../functions/animeFunctions";
import NewPlayer from "../components/CustomPlayer/NewPlayer";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft, faArrowRight, faBars} from "@fortawesome/free-solid-svg-icons";




const Watch:React.FC = () =>{

    const {id, seasonId, epId} = useParams();
    const [ep,setEp] = useState<Episode>()
    const [epUser,setEpUser] = useState<EpisodeUser>()
    const [ani,setAni]= useState<Anime>()
    const [eps,setEps] = useState<Map<number,Episode>>(new Map())
    // const [isCompleted,setIsCompleted] = useState<boolean>(false)

    // const plyrRef = useRef<APITypes>(null);

    // const popupRef = useRef<PopupActions>(null);
    const fetchEps = useCallback(async(ani:Anime,ep:Episode) =>{
        var res = await fetch(`/ep/g/season/${ani?.id}/${ep?.season_id}`)
        let data = await res.json()
        let epsMapTemp = new Map<number, Episode>();
        for(let i =0 ;i<data.length;i++){
            epsMapTemp.set(data[i].epindex, data[i]);
        }
        setEps(epsMapTemp);
    },[!eps])

    useEffect(()=>{
        const fetchData = async () => {
            try {
                const epRes = await fetch(`/ep/g/${id}/${seasonId}/${epId}`);
                const epData = await epRes.json();
                setEp(epData);

                const aniRes = await fetch(`/ani/g/${id}`);
                const aniData = await aniRes.json();
                setAni(aniData);

                if (aniData && epData) {
                    await fetchEps(aniData, epData);
                    const epUserRes = await fetchUser(`/ep/user/g/${aniData?.id}/${epId}`, 'GET');
                    const epUserData = await epUserRes.json();
                    if(epUserRes.ok){
                        // setIsCompleted(true);
                        console.log(epUserData.message);
                        if (epUserData.message) {
                            setEpUser(epUserData.message);
                        }
                    }
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchData()
        // console.log(`/Anime/${ani!._id}/watch/${seasonId!}/${ani?.seasons?.find(s=>s._id==seasonId)!._id}`)
    },[id, seasonId, epId, fetchEps, fetchUser])
    const handleChangeClass = (e:React.MouseEvent) =>{
        e.preventDefault()
        const element = document.getElementById("epSelDrop");

        if (element) {
            element.classList.toggle("ep-sel-show");
        }
    }




    const nextEpHandle = (e:React.MouseEvent) =>{
        e.preventDefault();
        console.log("nextEpHandle", eps)
        if(eps.has(ep?.epindex!+1)){
            window.location.href = `/Anime/${ani?.id}/watch/${ep?.season_id}/${eps.get(ep?.epindex! + 1)!.id}`
        }
    }
    const prevEpHandle = (e:React.MouseEvent) =>{
        e.preventDefault();
        if(eps.has(ep?.epindex!-1)){
            window.location.href = `/Anime/${ani?.id}/watch/${ep?.season_id}/${eps.get(ep?.epindex! - 1)!.id}`
        }
    }
    // $("#after").on("click",()=>handleNextEp(ani?.id!,seasonId,eps!,ep?.epindex!))
    return(
        <>
            {ani&&eps&&ep&&seasonId?(
                <html lang="pt-BR">
                <Helmet>
                    <title>Assistir: {ani.name}, {ep?.name}</title>
                </Helmet>
                <Header></Header>
                <Link className='link-anime' to={`/Anime/${id}`} id="linkAnime">
                    <div className="card">
                        <div className="card-hover">
                            <div>
                                <span>{ani?.name}</span><br/>
                                <span className="epSpan">{ep?.name}</span>
                            </div>
                            <div className="card-content-l">
                                {/*<div style={{margin:"auto"}}>*/}
                                {/*    <i className="fa-regular fa-star" data-rating="1"></i>*/}
                                {/*    <i className="fa-regular fa-star" data-rating="2"></i>*/}
                                {/*    <i className="fa-regular fa-star" data-rating="3"></i>*/}
                                {/*    <i className="fa-regular fa-star" data-rating="4"></i>*/}
                                {/*    <i className="fa-regular fa-star" data-rating="5"></i>*/}
                                {/*</div>*/}
                                <LikeButton></LikeButton>
                            </div>
                        </div>
                        <div className="card-img">
                            <img src={`${cdnUrl}/ani/img?Id=${ani?.id}`} alt={ani?.name}></img>
                        </div>
                    </div>
                </Link>
                {ani&&ep?(
                    <NewPlayer aniId={ani.id} seasonId={seasonId} ep={ep} epUser={epUser} eps={eps}/>
                ):<></>}
                {/*<Player ep={ep} ani={ani} seasonId={seasonId} eps={eps} epUser={epUser}/>*/}
                <div className="ep-sel1">
                    <div>
                        <p>Nome Episódio: <span>{ep?.name}</span></p>
                        <p>Vizualizações: <span>{ep.views??0}</span></p>
                        <p>Data de Lançamento: <span>{DateToStringLocal(new Date(ep?.releasedate!))}</span></p>
                    </div>
                    <div className="ep-select">
                        <div style={{display:"flex",alignItems:"center",justifyContent:"center"}}>

                            <button className="ep-sel-but" onClick={prevEpHandle} disabled={isFirstEp(eps,ep)}>
                                <FontAwesomeIcon icon={faArrowLeft}/>
                            </button>

                            <button className="ep-sel-but" onClick={handleChangeClass}>
                                <FontAwesomeIcon icon={faBars}/>
                            </button>

                            <button className="ep-sel-but" onClick={nextEpHandle} disabled={isLastEp(eps,ep)}>
                                <FontAwesomeIcon icon={faArrowRight}/>
                            </button>

                        </div>
                        <div>
                            <div id="epSelDrop" className="ep-sel-dropdown">
                                <div className="inEps">
                                    {Array.from(eps.values())
                                        .sort((a, b) => a.epindex - b.epindex)
                                        .map((e) => (
                                            <EpisodeDropdown
                                                epId={e.id}
                                                epNom={e.name}
                                                aniId={ani.id}
                                                seasonId={seasonId!}
                                                epNId={ep?.id!}
                                                key={e.epindex}
                                            />
                                        ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Comments indentifier={ep.id} type={'Episódio'} name={ep.name}/>
                <Footer/>
            </html>
            ):(
                <Loading/>
            )}
        </>
    )
}

export default Watch
