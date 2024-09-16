import {Link, useParams} from "react-router-dom";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {Episode, EpisodeUser} from "../types/episodeModel";
import {Anime} from "../types/animeModel";
import {Helmet} from "react-helmet";
import Loading from "../components/Loading";
import Header from "../components/Header";
import LikeButton from "../assets/LikeButton";
import {cdnUrl} from "../const";
import PlayerPopup from "../components/CustomPlayer/components/PlayerPopup.tsx";
import Player from "../components/Player/Player";
import {DateToStringLocal, fetchUser, handleNextEp} from "../features/main";
import EpisodeDropdown from "../assets/EpisodeDropdown";
import Comements from "../components/Comments";
import Footer from "../components/Footer";
import Plyr, {APITypes, PlyrOptions, PlyrSource, usePlyr} from "plyr-react";
import {isFirstEp, isLastEp} from "../functions/animeFunctions";
import ReactDOM from 'react-dom';
import {quality} from "../types/types";
import 'plyr/dist/plyr.css'
import "../css/watch.css"
import ReactDOMServer from "react-dom/server";

const Watch:React.FC = () => {
    const {id, seasonId, epId} = useParams();
    const [ep, setEp] = useState<Episode>();
    const [epUser, setEpUser] = useState<EpisodeUser | null>(null);
    const [ani, setAni] = useState<Anime>()
    const [eps, setEps] = useState<Map<number, Episode>>(new Map())

    const [popupOpen,setPopupOpen] = useState<boolean>(false)

    const [plyrSource, setPlyrSource] = useState<PlyrSource | null>(null);

    const plyrRef = useRef<APITypes>(null)




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





    const handleSkipIntro =(inEnd:number)=>{
        console.log(inEnd)
        plyrRef.current!.plyr.currentTime = inEnd
    }

    const skIButton = $(ReactDOMServer.renderToStaticMarkup(
        <div className="skip-intro plyr__controls__item plyr__control" id='intro'>
            <span>Pular intro</span>
            <i className="fa-solid fa-chevron-right"></i>
        </div>
    )).on('click',()=>handleSkipIntro(ep?.openingend!));

    const skEButton = $(ReactDOMServer.renderToStaticMarkup(
        <div className="skip-intro plyr__controls__item plyr__control" id='outro' onClick={()=>handleNextEp(ani?.id!,seasonId!,eps,ep?.epindex!)}>
            <span>Próximo episódio</span>
            <i className="fa-solid fa-chevron-right"></i>
        </div>

    )).on('click',()=>handleNextEp(ani?.id!,seasonId!,eps,ep?.epindex!));
    function handleTimeUpdate(){
        const sec = plyrRef.current?.plyr.currentTime!;
        console.log(sec,ep?.openingstart, ep?.openingend,ep);
        console.log(sec >= ep?.openingstart! && sec <= ep?.openingend! && !isFirstEp(eps, ep!))
        console.log(sec >= ep?.openingstart!)
        console.log(sec <= ep?.openingend!)
        console.log(isFirstEp(eps, ep!))
        // Manipula o botão "Pular intro"
        if (sec >= ep?.openingstart! && sec <= ep?.openingend! && !isFirstEp(eps, ep!)) {
            skIButton.addClass('skip-active');
        } else {
            skIButton.removeClass('skip-active');
        }

        // Manipula o botão "Próximo episódio"
        if (sec >= ep?.ending!) {
            if (isLastEp(eps, ep!)) {
                skEButton.removeClass('skip-active');
            } else {
                skEButton.addClass('skip-active');
            }
        } else {
            skEButton.removeClass('skip-active');
        }
    }
    useEffect(()=>{
        // const volumeElement = document.querySelector('.plyr__volume');
        const init = async()=>{
            while (!plyrRef.current || !plyrRef.current.plyr || !plyrRef.current.plyr.elements || !plyrRef.current.plyr.elements.container) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            const newSource = getResolutions(ep?.resolution!);
            let plyr = plyrRef.current.plyr

            setPlyrSource(newSource)
            console.log('aaa');

            plyr.on('timeupdate', handleTimeUpdate);
            // plyr.elements.container?.addEventListener("timeupdate",handleTimeUpdate)

            // Adiciona o event listener para 'timeupdate'
            // plyr.on('timeupdate', handleTimeUpdate)

            // Insere os botões após o elemento de volume
            $(plyr.elements.controls!).children('.plyr__volume').after(skIButton);
            $(plyr.elements.controls!).children('.skip-intro').after(skEButton);
        }
        if(ani && ep && plyrRef.current && plyrRef.current.plyr){
            init()
        }
        return () => {
            // Cleanup para remover o event listener quando o componente desmontar
            // const plyr = plyrRef.current?.plyr;
            // if (plyrRef.current?.plyr) {
            //     // plyr?.off('timeupdate', handleTimeUpdate); // Pode não funcionar se `off` não estiver disponível
            //     // Alternativamente, você pode usar `destroy` para limpar tudo
            //     plyr?.destroy();
            //
            // }
        };
    },[!plyrRef.current,!ep, !ani]);

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
    }, [!ani,!ep]);


    const optionsPlyr:PlyrOptions = {
        autoplay:true,
        settings:['captions', 'quality', 'speed', 'loop'],
        controls:['play-large', // The large play button in the center
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
        storage:{ enabled: true, key: 'plyr' },
        keyboard:{focused:true,global:true},
        tooltips:{controls:true,seek:true}
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
        console.log(d)
        return d
    }






    return(
        <>
            {ani && eps && ep?(
                <html lang='pt-BR'>
                <Helmet>
                    <title>Assistir: {ani.name}, {ep.name}</title>
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
                <div style={{display: "flex", justifyContent: "center"}}>
                    {/*<PlayerPopup plyrRef={plyrRef} epUser={epUser} open={popupOpen} setOpen={setPopupOpen}/>*/}
                    <Plyr
                        source={plyrSource}
                        ref={plyrRef}
                        options={optionsPlyr}
                    />
                    {/*<Player ani={ani} ep={ep} eps={eps} seasonId={seasonId!} ref={plyrRef}/>*/}
                </div>
                <div className="ep-sel1">
                    <div>
                        <p>Nome Episódio: <span>{ep?.name}</span></p>
                        <p>Data de Lançamento <span>{DateToStringLocal(new Date(ep?.releasedate!))}</span></p>
                    </div>
                    <div className="ep-select">
                        <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>

                            <button className="ep-sel-but" onClick={prevEpHandle} disabled={isFirstEp(eps,ep)}>
                                <i className="fa-solid fa-arrow-left"></i>
                            </button>

                            <button className="ep-sel-but" onClick={handleChangeClass}>
                                <i className="fa-solid fa-bars"></i>
                            </button>

                            <button className="ep-sel-but" onClick={nextEpHandle} disabled={isLastEp(eps,ep)}>
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
                {/*<Comements indentifier={ep.id} type={'Episódio'} name={ep.name}/>*/}
                <Footer/>
                </html>
            ) : (
                <Loading/>
            )}
        </>
    )
}
export default Watch
