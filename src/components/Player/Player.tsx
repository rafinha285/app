import React, {useContext, useEffect, useRef} from "react";
import {Episode, EpisodeUser} from "../../types/Episode.ts";
import {Anime} from "../../types/Anime.ts";
import Plyr, {APITypes, PlyrOptions, PlyrSource} from "plyr-react";
import {quality} from "../../types/types";
import {cdnUrl} from "../../const";
import ReactDOMServer from "react-dom/server";
import {fetchUser, handleEpWatching, handleNextEp} from "../../features/main";
import {isFirstEp, isLastEp} from "../../functions/animeFunctions";
import globalContext from "../../GlobalContext";
import 'plyr/dist/plyr.css'
import "../../css/watch.css"
import PlayerPopup from "../CustomPlayer/components/PlayerPopup.tsx";

interface props{
    ani:Anime
    ep:Episode,
    eps:Map<number,Episode>;
    seasonId:string,
    epUser?:EpisodeUser
}
const Player:React.FC<props> = ({ani,ep,eps,seasonId,epUser}) =>{

    const context = useContext(globalContext)!;
    const [open, setOpen] = React.useState<boolean>(true);

    const ref = useRef<APITypes>(null)
    // const [logSent,setLogSent]=useState(false);
    // $.ajax({
    //     url:`/api/g/s/eps/${ani.id}/${seasonId}`
    // }).done((res:Episode[])=>{
    //     // eps = res

    // })
    async function setPrevPosEp(){
        setTimeout(()=>{},5000)
        var prevEp = eps.get(ep.epindex-1)
        // console.log(prevEp,res,ep.epindex)
        if(prevEp){
            console.log(`/Anime/${ani.id}/watch/${seasonId}/${prevEp.id}`)
            $("#before").attr("href",`/Anime/${ani.id}/watch/${seasonId}/${prevEp.id}`)
        }
        var posEp = eps.get(ep.epindex+1)
        if(posEp){
            console.log(`/Anime/${ani.id}/watch/${seasonId}/${posEp.id}`)
            // var after:HTMLElement = document.getElementById("after")!
            // after.setAttribute("onclick",`window.location.href = /Anime/${ani.id}/watch/${seasonId}/${posEp.id}`)

            $("#after").attr("href",`/Anime/${ani.id}/watch/${seasonId}/${posEp.id}`)
        }
    }
    setPrevPosEp()


    // const resolutions = (epResolution:quality):Plyr.Source[]=>{
    //     const index = res.findIndex((resolution) => epResolution.includes(resolution));

    //     if (index >= 0) {
    //       return res.slice(index).map((v) => ({
    //         src: `/api/ep/${aniId}/${seasonId}/${ep.id}/${ep.id}-${v.split("x")[1]}-1080.mp4`, // Substitua isso pela URL real.
    //         type: 'video/mp4', // Supondo que o tipo seja sempre mp4.
    //         label: v,
    //         size:parseInt(v.split("x")[1])
    //       }));
    //     }
    //     return [];
    // }


    const createCaptionsTracks = (subtitles:string[]|null):Plyr.Track[] =>{
        console.log(subtitles)
        if(!subtitles){
            return []
        }else{
            return subtitles.map((languageCode, index) => ({
                kind: 'captions',
                label: languageCode,
                srcLang: subtitles[index], // Usa o código original
                src: `/ep/g/caption/${ani.id}/${seasonId}/${ep.id}/${subtitles[index]}`,
                default: subtitles[index] === "por", // Define o português como padrão
            }));
        }
    }

    const getResolutions = (epReso:string[]):PlyrSource=>{
        // const resolutions = ['1080p', '720p', '480p'];
        // const baseUrl = `${cdnUrl}/ep/${ani.id}/${seasonId}/${ep.id}`
        let resolutions:quality[] = epReso.map(v=>`${v.split("x")[1]}p`) as quality[]
        const baseVideoUrl = `${cdnUrl}/stream/${ani.id}/${seasonId}/${ep.id}`
        console.log(ep.subtitlestracks)
        const captionPlyrTracks = createCaptionsTracks(ep.subtitlestracks!)

        const d:PlyrSource = {
            type:"video",
            poster:`${cdnUrl}/epPoster/${ani.id}/${seasonId}/${ep.id}`,
            sources:resolutions.map((reso) => ({
                src: `${baseVideoUrl}/${reso.replace("p", "")}`,
                type: "video/mp4",
                label: reso,
                size: parseInt(reso.replace("p", ""), 10),
            })),
            tracks:captionPlyrTracks
        }
        console.log(d)
        return d
    }
    let intervalwatching:any = null;
    const handleSkipIntro =(inEnd:number)=>{
        console.log(inEnd)
        ref.current!.plyr.currentTime = inEnd
    }
    const handlePostSec = async(sec:number)=>{
        if(context.isLogged){
            // let getEp:{success:boolean,message?:any} = await fetchUser(`/ep/user/g/${ani.id}/${ep.id}`,'GET').then(res=>res.json())
            // if(!getEp.message){
                let body = {
                    episode_id:ep.id,
                    anime_id:ep.anime_id,
                    dropped_on:sec,
                    season_id:ep.season_id,
                }
                await fetchUser('/ep/user/p/','POST',body)
            // }
        }
    }

    const handlePause = async(plyr:Plyr)=>{
        await handlePostSec(plyr.currentTime)
        // if((plyr.currentTime / ep.duration!) > .05){
        // }
    }

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
    const initPlyr = async()=>{
        while (!ref.current || !ref.current.plyr || !ref.current.plyr.elements) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        var plyr = ref.current.plyr!
        plyr.source = getResolutions(ep.resolution)
        plyr.on("pause", () => handlePause(plyr));
        console.log(ep.resolution)
        console.log(plyr.source)

        // await handleGetSec()

        var seasonEp = eps

        const opIni = ep.openingstart
        const opFim = ep.openingend
        const ed = ep.ending
        // $("#intro").on("click",()=>handleSkipIntro(opFim))

        const skIn = $(plyr.elements.controls!)
        var buOp = (<div className="skip-intro plyr__controls__item plyr__control" onClick={()=>handleSkipIntro(opFim)}>
            <span>Pular intro</span>
            <i className="fa-solid fa-chevron-right"></i>
        </div>)
        const skIButton = $(ReactDOMServer.renderToStaticMarkup(buOp)).prop("id", "intro").on("click",()=>handleSkipIntro(opFim));
        skIn.children(".plyr__volume").after(skIButton);

        const intr = $(plyr.elements.controls!).find("#intro");
        // @ts-ignore
        let buEd = (<div className="skip-intro plyr__controls__item plyr__control" onClick={()=>handleNextEp(ani.id,seasonId,seasonEp,ep.epindex,context.isLogged)}>
            <span>Proximo episodio</span>
            <i className="fa-solid fa-chevron-right"></i>
        </div>)
        // @ts-ignore
        const skEButton = $(ReactDOMServer.renderToStaticMarkup(buEd)).prop("id", "outro").on("click",()=>handleNextEp(ani.id,seasonId,seasonEp,ep.epindex,context.isLogged));
        intr.after(skEButton);
        // if(epUser){
        //     setOpen(true)
        //     renderPlayerPopup(plyr.elements.container!,ref,open,setOpen,epUser)
        // }


        console.log(seasonEp,ep.epindex, !isFirstEp(eps,ep))
        function handleTimeUpdate() {
            if (open) return;
            const sec = plyr.currentTime;
            if (sec >= opIni && sec <= opFim && !isFirstEp(eps,ep)) {
                skIButton.addClass("skip-active");
            } else {
                skIButton.removeClass("skip-active");
            }
            if (sec >= ed) {
                if(context.isLogged){
                    clearInterval(intervalwatching!)
                    intervalwatching = null
                    handleEpWatching(ani.id,seasonId,ep,plyr.currentTime,true)
                }
                if (isLastEp(eps,ep)) {
                    skEButton.removeClass("skip-active");
                } else {
                    skEButton.addClass("skip-active");
                }
            } else {
                skEButton.removeClass("skip-active");
            }
            if(sec / ep.duration! > .05) {
            }
        }
        // const handleLoadedSeconds = ()=>{
        //     const buffered = plyr.buffered;
        //     const duration = plyr.duration;
        //
        //     if (duration) {
        //         const loaded = buffered * duration;
        //         setLoadedSeconds(loaded);
        //
        //         if (loaded >= 5 && !canPlay) {
        //             setCanPlay(true);
        //             plyr.play();
        //         }
        //     }
        // }
        // plyr.on()
        plyr.elements.container?.addEventListener('pause',()=>handlePause(plyr))
        plyr.elements.container?.addEventListener("timeupdate",handleTimeUpdate)
        plyr.elements.container?.addEventListener("seeking",handleTimeUpdate)
        // plyr.elements.container?.addEventListener('progress',handleLoadedSeconds)
        // const lastLoggedTime:number[] = [];
    }
    const handleEpUserSkip = (skip:number)=>{
        ref.current!.plyr.currentTime = skip;
        setOpen(false)
    }
    useEffect(() => {
        initPlyr()
        return()=>{
            // ref.current!.plyr.destroy()
        }
    },[])
    window.addEventListener("beforeunload",function(e){
        // handlePostSec(ref.current!.plyr!.currentTime)
        // handleEpWatching(ani.id, seasonId, ep, ref.current?.plyr?.currentTime!, ref.current?.plyr.currentTime!>= ep.ending);
    })
    return(
        <div className='player-wrapper'>
            <PlayerPopup open={open} setOpen={setOpen} epUser={epUser} handleSkip={handleEpUserSkip}/>
            <Plyr source={{type:"video",sources:[]}} ref={ref}  options={optionsPlyr}></Plyr>
        </div>
    )
}
export default Player;
