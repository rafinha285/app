import React, {useCallback, useContext, useEffect, useRef, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {Episode,EpisodeUser} from "../types/episodeModel";
import {Anime} from "../types/animeModel";
import Plyr, {APITypes, PlyrOptions, PlyrSource} from "plyr-react";
import Loading from "../components/Loading";
import {Helmet} from "react-helmet";
import Header from "../components/Header";
import LikeButton from "../assets/LikeButton";
import {cdnUrl} from "../const";
import PlayerPopup from "../components/CustomPlayer/components/PlayerPopup.tsx";
import globalContext from "../GlobalContext";
import {quality} from "../types/types";
import {DateToStringLocal, fetchUser, handleNextEp} from "../features/main";
import {getEpsFromSeason} from "../functions/animeFunctions";
import ReactDOMServer from "react-dom/server";
import EpisodeDropdown from "../assets/EpisodeDropdown";
import Footer from "../components/Footer";
import "../css/watch.css"
import 'plyr/dist/plyr.css'
import Comements from "../components/Comments";


const Watch:React.FC = () => {
    const {id, seasonId, epId} = useParams();
    const [ep, setEp] = useState<Episode | null>(null);
    const [epUser, setEpUser] = useState<EpisodeUser | null>(null);
    const [ani, setAni] = useState<Anime>()
    const [eps, setEps] = useState<Map<number, Episode>>(new Map())
    const context = useContext(globalContext)!;

    const plyrRef = useRef<APITypes>(null);

    //watch handles
    const isFirstEp = (eps: Map<number, Episode>): boolean => {
        const epIndexes = Array.from(eps.values()).map(v => v.epindex);
        return Math.min(...epIndexes) === ep?.epindex;
    }
    const isLastEp = (eps: Map<number, Episode>): boolean => {
        const epIndexes = Array.from(eps.values()).map(v => v.epindex);
        return Math.max(...epIndexes) === ep?.epindex;
    }

    const handleChangeClass = (e:React.MouseEvent) =>{
        e.preventDefault()
        $("#epSelDrop").toggleClass("ep-sel-show")
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

    //player functions
    async function setPrevPosEp() {
        setTimeout(() => {
        }, 5000)
        var prevEp = eps.get(ep?.epindex! - 1);  // Usando `get` do Map para obter o episódio anterior
        if (prevEp) {
            console.log(`/Anime/${ani?.id}/watch/${seasonId}/${prevEp.id}`);
            $("#before").attr("href", `/Anime/${ani?.id}/watch/${seasonId}/${prevEp.id}`);
        }

        var posEp = eps.get(ep?.epindex! + 1);  // Usando `get` do Map para obter o próximo episódio
        if (posEp) {
            console.log(`/Anime/${ani?.id}/watch/${seasonId}/${posEp.id}`);
            $("#after").attr("href", `/Anime/${ani?.id}/watch/${seasonId}/${posEp.id}`);
        }
    }



    const createCaptionsTracks = (subtitles: string[] | null): Plyr.Track[] => {
        console.log(subtitles)
        if (!subtitles) {
            return []
        } else {
            return subtitles.map((languageCode, index) => ({
                kind: 'captions',
                label: languageCode,
                srcLang: subtitles[index], // Usa o código original
                src: `/ep/g/caption/${ani?.id}/${seasonId}/${ep?.id}/${subtitles[index]}`,
                default: subtitles[index] === "por", // Define o português como padrão
            }));
        }
    }

    const getResolutions = (epReso: string[]): PlyrSource => {
        // const resolutions = ['1080p', '720p', '480p'];
        // const baseUrl = `${cdnUrl}/ep/${ani.id}/${seasonId}/${ep.id}`
        let resolutions: quality[] = epReso.map(v => `${v.split("x")[1]}p`) as quality[]
        const baseVideoUrl = `${cdnUrl}/stream/${ani?.id}/${seasonId}/${ep?.id}`
        console.log(ep?.subtitlestracks)
        const captionPlyrTracks = createCaptionsTracks(ep?.subtitlestracks!)

        const d: PlyrSource = {
            type: "video",
            poster: `${cdnUrl}/epPoster/${ani?.id}/${seasonId}/${ep?.id}`,
            sources: [],
            tracks: captionPlyrTracks
        }
        console.log(d)

        // var epResoo = `${epReso[0].split("x")[1]}p`
        switch (resolutions[0]) {
            case quality.FULLHD:
                console.log("FULLHD")
                d.sources = resolutions.map((reso, index) => ({
                    src: `${baseVideoUrl}/${reso.replace("p", "")}`,
                    type: "video/mp4",
                    label: reso,
                    size: index === 0 ? 1080 : index === 1 ? 720 : 480
                }))
                break
            case quality.HD:
                console.log("HD")
                d.sources = resolutions.slice(0, 2).map((reso, index) => ({
                    src: `${baseVideoUrl}/${reso.replace("p", "")}`,
                    type: 'video/mp4',
                    label: reso,
                    size: index === 0 ? 720 : 480,
                }))
                break
            case quality.SD:
                d.sources = [resolutions[2]].map((reso, index) => ({
                    src: `${baseVideoUrl}/${reso.replace("p", "")}`,
                    type: "video/mp4",
                    label: reso,
                    size: 480
                }))
                break
        }
        return d
    }
    const handleSkipIntro = (inEnd: number) => {
        console.log(inEnd)
        plyrRef.current!.plyr.currentTime = inEnd
    }

    const handlePause = async (plyr: Plyr) => {
        await handlePostSec(plyr.currentTime)
        // if((plyr.currentTime / ep.duration!) > .05){
        // }
    }

    const optionsPlyr: PlyrOptions = {
        autoplay: true,
        settings: ['captions', 'quality', 'speed', 'loop'],
        controls: ['play-large', // The large play button in the center
            // 'restart', // Restart playback
            'rewind', // Rewind by the seek time (default 10 seconds)
            'play', // Play/pause playback
            'fast-forward', // Fast forward by the seek time (default 10 seconds)
            'progress', // The progress bar and scrubber for playback and buffering
            'current-time', // The current time of playback
            'duration', // The full duration of the media
            'mute', // Toggle mute
            'volume', // Volume control
            'captions', // Toggle captions
            'settings', // Settings menu
            'pip', // Picture-in-picture (currently Safari only)
            'airplay', // Airplay (currently Safari only)
            'fullscreen', // Toggle fullscreen
        ],
        storage: {enabled: true, key: 'plyr'},
        keyboard: {focused: true, global: true},
        tooltips: {controls: true, seek: true}
    }


    // const initPlyr = async () => {
    //     while (!ep || !plyrRef.current || !plyrRef.current.plyr || !plyrRef.current.plyr.elements) {
    //         await new Promise(resolve => setTimeout(resolve, 100));
    //     }
    //     let plyr = plyrRef.current.plyr;
    //
    //     var seasonEp: Episode[] = await getEpsFromSeason(ep.anime_id, ep.season_id)
    //
    //     //popup tempo render
    //     // let popDiv = document.createElement('div')
    //     // ReactDOM.render((<PlayerPopup ref={popupRef} plyrRef={plyrRef} epUser={epUser}/>),document.getElementsByClassName("plyr")[0].appendChild(popDiv))
    //
    //     //adicionar o botão de pular intro
    //
    //
    //
    //
    //     //listeners do player
    //     plyr.elements.container?.addEventListener('pause', () => handlePause(plyr))
    //     plyr.elements.container?.addEventListener("timeupdate", handleTimeUpdate)
    //     plyr.elements.container?.addEventListener("seeking", handleTimeUpdate)
    // }
    // let seasonEp: Episode[] = await getEpsFromSeason(ep.anime_id, ep.season_id)
    function handleTimeUpdate(e: React.SyntheticEvent<HTMLVideoElement, Event>) {
        const sec = e.timeStamp
        // const sec = plyrRef.current?.plyr.currentTime!;
        if (sec >= ep?.openingstart! && sec <= ep?.openingend! && !isFirstEp(eps)) {
            skIButton.addClass("skip-active");
        } else {
            skIButton.removeClass("skip-active");
        }
        if (sec >= ep?.ending!) {
            if (isLastEp(eps)) {
                nextEpisodeButton.removeClass("skip-active");
            } else {
                nextEpisodeButton.addClass("skip-active");
            }
        } else {
            nextEpisodeButton.removeClass("skip-active");
        }
        // if(sec / ep?.duration! > .05){
        //
        // }
    }

    //fetchEps
    const fetchEps = useCallback(async(ani:Anime,ep:Episode) =>{
        var res = await fetch(`/ep/g/season/${ani?.id}/${ep?.season_id}`)
        let data = await res.json()
        let epsMapTemp = new Map<number, Episode>();
        for(let i =0 ;i<data.length;i++){
            epsMapTemp.set(data[i].epindex, data[i]);
        }
        setEps(epsMapTemp)
    },[!eps])

    const fetchEp = useCallback(async()=>{
        let res = await fetch(`/ep/g/${id}/${seasonId}/${epId}`).then(r=>r.json());
        setEp(res)
    },[!ep])

    const fetchEpUser = async()=>{
        let response:{success:boolean,message?:EpisodeUser} = await fetchUser(`/ep/user/g/${ani?.id}/${epId}`,'GET').then(r=>r.json());
        if(response.message){
            setEpUser(response.message)
            setPopupOpen(true)
        }
    }

    //useEffect anime
    useEffect(() => {
        const loadData = async () => {
            await fetchEp();
            const aniData = await fetch(`/ani/g/${id}`).then(r => r.json());
            setAni(aniData);

            if (ani && ep) {
                await fetchEps(ani, ep);
                await fetchEpUser();
            }
        };

        loadData();
        handleInsertButtons();
    }, [id, seasonId, epId]);

    const skIn = $(plyrRef.current?.plyr.elements.controls!)
    var buOp = (<div className="skip-intro plyr__controls__item plyr__control" onClick={()=>handleSkipIntro(ep?.openingend!)}>
        <span>Pular intro</span>
        <i className="fa-solid fa-chevron-right"></i>
    </div>)
    console.log(buOp)
    const skIButton = $(ReactDOMServer.renderToStaticMarkup(buOp)).prop("id", "intro").on("click",()=>handleSkipIntro(ep?.openingend!));


    const nextEpisodeButton = $('<div class="next-episode plyr__controls__item plyr__control" id="outro"><span>Próximo episódio</span><i class="fa-solid fa-chevron-right"></i></div>')
        .on("click", () => handleNextEp(ani?.id!,seasonId!,eps, ep?.epindex!));

    const [popupOpen,setPopupOpen] = useState<boolean>(false)

    const handleInsertButtons = async()=>{
        while (!ep || !plyrRef.current || !plyrRef.current.plyr || !plyrRef.current.plyr.elements||!plyrRef.current.plyr.elements.controls) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        const controlsContainer = $(plyrRef.current.plyr.elements.controls);
        // plyrRef.current.plyr.elements.controls?.appendChild(skipIntroButton)
        console.log(controlsContainer)

        controlsContainer.children(".plyr__volume").after(skIButton);
        console.log(controlsContainer)

        //adicionar o botão de próximo episódio
        const intr = $(plyrRef.current.plyr.elements.controls!).find("#intro");

        controlsContainer.append(nextEpisodeButton);
        console.log(controlsContainer)
    }

    //useEffect player
    useEffect(() => {

        // initPlyr();
        return()=>{
            plyrRef.current?.plyr.destroy()
        }
    }, []);
    window.addEventListener("beforeunload",function(e){

        handlePause(plyrRef?.current?.plyr!)
        // handleEpWatching(ani.id, seasonId, ep, ref.current?.plyr?.currentTime!, ref.current?.plyr.currentTime!>= ep.ending);
    })

    return (
        <>
            {ani && eps ? (
                <html lang='pt-BR'>
                    <Helmet>
                        <title>Assistir: {ani.name}, {ep?.name}</title>
                    </Helmet>
                    <Header/>
                    <Link style={{width: "fit-content", margin: "3em auto"}} to={`/Anime/${id}`} id="linkAnime">
                        <div className="card">
                            <div className="card-hover">
                                <div>
                                    <span>{ani?.name}</span><br/>
                                    <span className="epSpan">{ep?.name}</span>
                                </div>
                                <div className="card-content-l">
                                    <div style={{margin: "auto"}}>
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
                    {ep && ani && seasonId ?
                        <div style={{display: "flex", justifyContent: "center"}}>
                            <PlayerPopup plyrRef={plyrRef} epUser={epUser} open={popupOpen} setOpen={setPopupOpen}/>
                            <Plyr onTimeUpdate={(e)=>handleTimeUpdate(e)} source={getResolutions(ep.resolution)} ref={plyrRef} options={optionsPlyr}/>
                        </div>
                        : <></>}
                    <div className="ep-sel1">
                        <div>
                            <p>Nome Episódio: <span>{ep?.name}</span></p>
                            <p>Data de Lançamento <span>{DateToStringLocal(new Date(ep?.releasedate!))}</span></p>
                        </div>
                        <div className="ep-select">
                            <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>

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
                                                ></EpisodeDropdown>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Comements indentifier={ep?.id!} type={'Episódio'} name={ep?.name!} />
                    <Footer/>
                </html>
            ) : (
                <Loading/>
            )}
        </>
    )
}
export default Watch;
