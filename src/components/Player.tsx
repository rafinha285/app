import React, {useContext, useEffect, useRef, useState} from "react";
import { Episode, SubtitlesTracks } from "../types/episodeModel";
import { languages, quality } from "../types/types";
import Plyr,{APITypes,PlyrOptions,PlyrSource} from "plyr-react";
// import Plyr from "@rocketseat/react-plyr";
import ReactDOMServer from 'react-dom/server';
import 'plyr/dist/plyr.css'
import "../css/watch.css"
// import NetInfo from "@react-native-community/netinfo"
import { Anime } from "../types/animeModel";
import {handleEpWatched, handleNextEp} from "../features/main";
// import Flowplayer, { useFlowplayer } from "@flowplayer/react-flowplayer";
import postLog from "../functions/logFunctions";
import { getEpsFromSeason } from "../functions/animeFunctions";
import {cdnUrl, proxyUrl} from "../const";
import globalContext from "../GlobalContext";
interface prop{
    ani:Anime;
    seasonId:string;
    ep:Episode;
    eps:Episode[]
}

const Player:React.FC<prop> = ({ani,seasonId,ep,eps}) =>{
    // const ref = useRef<Plyr>(null)
    const res = ['1920x1080','1280x720', '854x480']
    console.log(ani,ep,eps)

    const context = useContext(globalContext)!;
    const [loadedSeconds, setLoadedSeconds] = useState(0);
    const [canPlay, setCanPlay] = useState(false);
    // $.ajax({
    //     url:`/api/g/s/eps/${ani.id}/${seasonId}`
    // }).done((res:Episode[])=>{
    //     // eps = res

    // })
    async function setPrevPosEp(){
        setTimeout(()=>{},5000)
        var prevEp = eps.find(v=>v.epindex === (ep.epindex-1))
        // console.log(prevEp,res,ep.epindex)
        if(prevEp){
            console.log(`/Anime/${ani.id}/watch/${seasonId}/${prevEp.id}`)
            $("#before").attr("href",`/Anime/${ani.id}/watch/${seasonId}/${prevEp.id}`)
        }
        var posEp = eps.find(v=>v.epindex === (ep.epindex+1))
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

    const ref = useRef<APITypes>(null);
    const createCaptionsTracks = (subtitles:string[]|null):Plyr.Track[] =>{
        console.log(subtitles)
        if(!subtitles){
            return []
        }else{
            return subtitles.map((languageCode, index) => ({
                kind: 'captions',
                label: languageCode,
                srcLang: subtitles[index], // Usa o código original
                src: `/api/ep/${ani.id}/${seasonId}/${ep.id}/${ep.id}-${subtitles[index]}.vtt`,
                default: subtitles[index] === "por", // Define o português como padrão
            }));
        }
    }
    const getResolutions = (epReso:string[]):PlyrSource=>{
        const resolutions = ['1080p', '720p', '480p'];
        const baseUrl = `${cdnUrl}/ep/${ani.id}/${seasonId}/${ep.id}`
        const baseVideoUrl = `${cdnUrl}/stream/${ani.id}/${seasonId}/${ep.id}`
        console.log(ep.subtitlestracks)
        const captionPlyrTracks = createCaptionsTracks(ep.subtitlestracks!)

        const d:PlyrSource = {
            type:"video",
            poster:`${baseUrl}/${ep.id}.jpg`,
            sources:[],
            tracks:captionPlyrTracks
        }
        console.log(d)

        var epResoo = `${epReso[0].split("x")[1]}p`
        switch(epResoo){
            case quality.FULLHD:
                console.log("FULLHD")
                d.sources = resolutions.map((reso,index)=>({
                    src: `${baseVideoUrl}/${reso.replace("p","")}`,
                    type: "video/mp4",
                    label: reso,
                    size: index === 0 ? 1080 : index === 1 ? 720 : 480
                }))
                break
            case quality.HD:
                console.log("HD")
                d.sources = resolutions.slice(0, 2).map((reso, index) => ({
                    src: `${baseVideoUrl}/${reso.replace("p","")}`,
                    type: 'video/mp4',
                    label: reso,
                    size: index === 0 ? 1080 : 720,
                  }))
                break
            case quality.SD:
                d.sources = [resolutions[2]].map((reso,index)=>({
                    src: `${baseVideoUrl}/${reso.replace("p","")}`,
                    type: "video/mp4",
                    label: reso,
                    size: 480
                }))
                break
        }
        return d
    }

    const handleSkipIntro =(inEnd:number)=>{
        console.log(inEnd)
        ref.current!.plyr.currentTime = inEnd
    }
    const optionsPlyr:PlyrOptions = {
        settings:['play-large', // The large play button in the center
            'restart', // Restart playback
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
            'download', // Show a download button with a link to either the current source or a custom URL you specify in your options
            'fullscreen', // Toggle fullscreen]
        ],
        controls:['play-large','play','progress','current-time','mute', 'volume', 'captions', 'settings', 'pip','fullscreen'],
        storage:{ enabled: true, key: 'plyr' },
        keyboard:{focused:true,global:true},
        tooltips:{controls:true,seek:true}
    }
    const initPlyr = async()=>{
        while (!ref.current || !ref.current.plyr || !ref.current.plyr.elements) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        var plyr = ref.current.plyr
        plyr.source = getResolutions(ep.resolution)
        console.log(ep.resolution)
        console.log(plyr.source)

        var seasonEp = await getEpsFromSeason(ep.animeid,ep.seasonid)

        const opIni = ep.openingstart
        const opFim = ep.openingend
        const ed = ep.ending
        // $("#intro").on("click",()=>handleSkipIntro(opFim))

        const skIn = $(plyr.elements.controls!)
        var buOp = (<div className="skip-intro plyr__controls__item plyr__control" onClick={()=>handleSkipIntro(opFim)}>
            <span>Pular intro</span>
            <i className="fa-solid fa-chevron-right"></i>
        </div>)
        console.log(buOp)
        const skIButton = $(ReactDOMServer.renderToStaticMarkup(buOp)).prop("id", "intro").on("click",()=>handleSkipIntro(opFim));
        console.log(skIn.children(".plyr__volume"),skIButton)
        skIn.children(".plyr__volume").after(skIButton);

        const intr = $(plyr.elements.controls!).find("#intro");
        // @ts-ignore
        var buEd = (<div className="skip-intro plyr__controls__item plyr__control" onClick={()=>handleNextEp(ani.id,seasonId,seasonEp,ep.epindex,context.isLogged)}>
            <span>Proximo episodio</span>
            <i className="fa-solid fa-chevron-right"></i>
        </div>)
        // @ts-ignore
        const skEButton = $(ReactDOMServer.renderToStaticMarkup(buEd)).prop("id", "outro").on("click",()=>handleNextEp(ani.id,seasonId,seasonEp,ep.epindex,context.isLogged));
        intr.after(skEButton);



        console.log(seasonEp,ep.epindex,ep.epindex !=  Math.min(...seasonEp.map((v)=>v.epindex)))
        // postLog(ani,true,ep.id,plyr.currentTime)
        function handleTimeUpdate() {
            const sec = plyr.currentTime;
            console.log(`sec >= opIni && sec <= opFim:${sec >= opIni && sec <= opFim},\n sec: ${sec},\n opIni: ${opIni},\n sec >= opIni: ${sec >= opIni},\n opFim: ${opFim},\n sec <= opFim: ${sec <= opFim}`)
            // console.log(ep.epindex != Math.min(...seasonEp.map((v)=>v.index)),Math.min(...seasonEp.map((v)=>v.index)),ep.epindex)
            if (sec >= opIni && sec <= opFim && ep.epindex != Math.min(...seasonEp.map((v)=>v.epindex))) {
                // console.log("skip-active ep")
                skIButton.addClass("skip-active");
            } else {
                // console.log("not skip-active op")
                skIButton.removeClass("skip-active");
            }

            if (sec >= ed) {
                handleEpWatched(ani.id,seasonId,ep)
                if (Math.max(...seasonEp.map((ep) => ep.epindex)) === ep.epindex) {
                    // console.log("not skip-active ed")
                    skEButton.removeClass("skip-active");
                } else {
                    // console.log("skip-active ed")
                    skEButton.addClass("skip-active");
                }
            } else {
                // console.log("not skip-active ed")
                skEButton.removeClass("skip-active");
            }
            // const currentTimeInSeconds = Math.floor(sec)
            // if(currentTimeInSeconds%60===0&&!lastLoggedTime.includes(currentTimeInSeconds)){
            //     postLog(ani,true,ep.id,sec)
            //     lastLoggedTime.push(currentTimeInSeconds);
            // }
        }
        const handleLoadedSeconds = ()=>{
            const buffered = plyr.buffered;
            const duration = plyr.duration;

            if (duration) {
                const loaded = buffered * duration;
                setLoadedSeconds(loaded);

                if (loaded >= 5 && !canPlay) {
                    setCanPlay(true);
                    plyr.play();
                }
            }
        }

        // plyr.on()
        plyr.elements.container?.addEventListener("timeupdate",handleTimeUpdate)
        plyr.elements.container?.addEventListener("seeking",handleTimeUpdate)
        plyr.elements.container?.addEventListener('seeking',handleLoadedSeconds)
        // const lastLoggedTime:number[] = [];
    }

    useEffect(()=>{
        initPlyr()
        return()=>{
            ref.current!.plyr.destroy()
        }
    },[])
    useEffect(() => {
        if(ref.current){
            if (canPlay) {
                ref.current.plyr.play();
            } else {
                ref.current.plyr.pause();
            }
        }
    }, [canPlay]);
    return(
        <Plyr source={{type:"video",sources:[]}} ref={ref}  options={optionsPlyr}></Plyr>
    )
}
export default Player
