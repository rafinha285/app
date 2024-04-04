import React,{useEffect, useRef} from "react";
import { Episode, SubtitlesTracks } from "../types/episodeModel";
import { languages, quality } from "../types/types";
import Plyr,{APITypes,PlyrOptions,PlyrSource} from "plyr-react";
// import Plyr from "@rocketseat/react-plyr";
import ReactDOMServer from 'react-dom/server';
import 'plyr/dist/plyr.css'
import "../css/watch.css"
// import NetInfo from "@react-native-community/netinfo"
import { Anime } from "../types/animeModel";
import { handleNextEp } from "../features/main";
// import Flowplayer, { useFlowplayer } from "@flowplayer/react-flowplayer";
import postLog from "../functions/logFunctions";
import { getEpsFromSeason } from "../functions/animeFunctions";
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
    
    // $.ajax({
    //     url:`/api/g/s/eps/${ani.id}/${seasonId}`
    // }).done((res:Episode[])=>{
    //     // eps = res
        
    // })
    async function setPrevPosEp(){
        setTimeout(()=>{},500)
        var prevEp = eps.find(v=>v.epindex === (ep.epindex-1))
        console.log(prevEp,res,ep.epindex)
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
    const createCaptionsTracks = (subtitles:string[]):Plyr.Track[] =>{
        console.log(subtitles)
        return subtitles.map((languageCode, index) => ({
            kind: 'captions',
            label: languageCode,
            srcLang: subtitles[index], // Usa o código original
            src: `/api/ep/${ani.id}/${seasonId}/${ep.id}/${ep.id}-${subtitles[index]}.vtt`,
            default: subtitles[index] === "por", // Define o português como padrão
        }));
    }
    const getResolutions = (epReso:string[]):PlyrSource=>{
        const resolutions = ['1080p', '720p', '480p'];
        const baseUrl = `/api/ep/${ani.id}/${seasonId}/${ep.id}`
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
                    src:`${baseUrl}/${ep.id}-${reso.replace("p","")}.mp4`,
                    type:"video/mp4",
                    label:reso,
                    size:index === 0 ? 1080 : index === 1 ? 720 : 480
                }))
                break
            case quality.HD:
                console.log("HD")
                d.sources = resolutions.slice(0, 2).map((reso, index) => ({
                    src: `${baseUrl}/${ep.id}-${reso.replace("p","")}.mp4`,
                    type: 'video/mp4',
                    label: reso,
                    size: index === 0 ? 1080 : 720,
                  }))
                break
            case quality.SD:
                d.sources = [resolutions[2]].map((reso,index)=>({
                    src:`${baseUrl}/${ep.id}-${reso.replace("p","")}.mp4`,
                    type:"video/mp4",
                    label:reso,
                    size:480
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
        settings:["captions","quality","speed","loop"],
        controls:['play-large','play','progress','current-time','mute', 'volume', 'captions', 'settings', 'pip','fullscreen'],
        storage:{ enabled: true, key: 'plyr' },
        keyboard:{focused:true,global:true},
        tooltips:{controls:false,seek:true}
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
        var buEd = (<div className="skip-intro plyr__controls__item plyr__control" onClick={()=>handleNextEp(ani.id,seasonId,seasonEp,ep.epindex)}>
            <span>Poximo episodio</span>
            <i className="fa-solid fa-chevron-right"></i>
        </div>)
        const skEButton = $(ReactDOMServer.renderToStaticMarkup(buEd)).prop("id", "outro").on("click",()=>handleNextEp(ani.id,seasonId,seasonEp,ep.epindex))
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
        
        plyr.elements.container?.addEventListener("timeupdate",handleTimeUpdate)
        // const lastLoggedTime:number[] = [];
    }

    useEffect(()=>{
        initPlyr()
    },[])
    return(
        <Plyr source={{type:"video",sources:[]}} ref={ref}  options={optionsPlyr}></Plyr>
    )
}
export default Player