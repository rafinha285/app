import React,{useEffect, useRef} from "react";
import { Episode, SubtitlesTracks } from "../types/episodeModel";
import { languages, quality } from "../types/types";
import Plyr, { APITypes, PlyrSource } from "plyr-react";
import ReactDOMServer from 'react-dom/server';
import 'plyr/dist/plyr.css'
import "../css/watch.css"
// import NetInfo from "@react-native-community/netinfo"
import { AnimeDocument } from "../types/animeModel";
import Flowplayer, { useFlowplayer } from "@flowplayer/react-flowplayer";
import postLog from "../functions/logFunctions";
interface prop{
    ani:AnimeDocument;
    seasonId:string;
    ep:Episode
}

const Player:React.FC<prop> = ({ani,seasonId,ep}) =>{
    const ref = useRef<APITypes>(null)
    const res = ['1920x1080','1280x720', '854x480']

    // const resolutions = (epResolution:quality):Plyr.Source[]=>{
    //     const index = res.findIndex((resolution) => epResolution.includes(resolution));

    //     if (index >= 0) {
    //       return res.slice(index).map((v) => ({
    //         src: `/api/ep/${aniId}/${seasonId}/${ep._id}/${ep._id}-${v.split("x")[1]}-1080.mp4`, // Substitua isso pela URL real.
    //         type: 'video/mp4', // Supondo que o tipo seja sempre mp4.
    //         label: v,
    //         size:parseInt(v.split("x")[1])
    //       }));
    //     }
    //     return [];
    // }

    const createCaptionsTracks = (subtitles:string[]):Plyr.Track[] =>{
        console.log(subtitles)
        return subtitles.map((languageCode, index) => ({
            kind: 'captions',
            label: languageCode,
            srcLang: subtitles[index], // Usa o código original
            src: `/api/ep/${ani._id}/${seasonId}/${ep._id}/${ep._id}-${subtitles[index]}.vtt`,
            default: subtitles[index] === languages.Portuguese, // Define o português como padrão
        }));
    }
    const getResolutions = (epReso:quality):PlyrSource=>{
        const resolutions = ['1080p', '720p', '480p'];
        const baseUrl = `/api/ep/${ani._id}/${seasonId}/${ep._id}`
        console.log(ep.subtitlesTracks)
        const captionPlyrTracks = createCaptionsTracks(ep.subtitlesTracks)

        const d:PlyrSource = {
            type:"video",
            poster:`${baseUrl}/${ep._id}.jpg`,
            sources:[],
            tracks:captionPlyrTracks
        }
        switch(epReso){
            case quality.FULLHD:
                d.sources = resolutions.map((reso,index)=>({
                    src:`${baseUrl}/${ep._id}-${reso.replace("p","")}.mp4`,
                    type:"video/mp4",
                    label:reso,
                    size:index === 0 ? 1080 : index === 1 ? 720 : 480
                }))
                return d
            case quality.HD:
                d.sources = resolutions.slice(0, 2).map((reso, index) => ({
                    src: `${baseUrl}/${ep._id}-${reso.replace("p","")}.mp4`,
                    type: 'video/mp4',
                    label: reso,
                    size: index === 0 ? 1080 : 720,
                  }))
                return d
            case quality.SD:
                d.sources = [resolutions[2]].map((reso,index)=>({
                    src:`${baseUrl}/${ep._id}-${reso.replace("p","")}.mp4`,
                    type:"video/mp4",
                    label:reso,
                    size:480
                }))
                return d
        }
    }
    const handleSkipIntro =(inEnd:number)=>{
        console.log(inEnd)
        ref.current!.plyr.currentTime = inEnd
    }
    const handleNextEp = ()=>{
        var eps = ani.seasons?.find(s=>s._id === seasonId)?.episodes!
        let indiceAtual=eps?.findIndex(e=>e._id === ep._id)
        let proximoEp = eps[indiceAtual!+1]
        window.location.href = `/Anime/${ani._id}/watch/${seasonId}/${proximoEp._id}`
    }
    const initPlyr = async()=>{
        while (!ref.current || !ref.current.plyr || !ref.current.plyr.elements) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        var plyr = ref.current.plyr
        plyr.source = getResolutions(ep.resolution)

        const opIni = ep.openingStart
        const opFim = ep.openinigEnd
        const ed = ep.ending

        

        const skIn = $(plyr.elements.controls!)
        var buOp = (<div className="skip-intro plyr__controls__item plyr__control" onClick={()=>handleSkipIntro(opFim)}>
            <span>Pular intro</span>
            <i className="fa-solid fa-chevron-right"></i>
        </div>)
        const skIButton = $(ReactDOMServer.renderToStaticMarkup(buOp)).prop("id", "intro").on("click",()=>handleSkipIntro(opFim));
        console.log(skIn.children(".plyr__volume"),skIButton)
        skIn.children(".plyr__volume").after(skIButton);

        const intr = $(plyr.elements.controls!).find("#intro");
        var buEd = (<div className="skip-intro plyr__controls__item plyr__control" onClick={handleNextEp}>
            <span>Poximo episodio</span>
            <i className="fa-solid fa-chevron-right"></i>
        </div>)
        const skEButton = $(ReactDOMServer.renderToStaticMarkup(buEd)).prop("id", "outro").on("click",handleNextEp);
        intr.after(skEButton);

        const seasonEp = ani.seasons?.find((v) => v._id === seasonId)?.episodes!;
        postLog(ani,true,ep._id,plyr.currentTime)
        function handleTimeUpdate() {
            const sec = plyr.currentTime;
            console.log(sec >= opIni && sec <= opFim, sec, opIni, sec >= opIni, sec, opFim, sec <= opFim)
            // console.log(ep.index != Math.min(...seasonEp.map((v)=>v.index)),Math.min(...seasonEp.map((v)=>v.index)),ep.index)
            if (sec >= opIni && sec <= opFim && ep.index != Math.min(...seasonEp.map((v)=>v.index))) {
                // console.log("skip-active ep")
                skIButton.addClass("skip-active");
            } else {
                // console.log("not skip-active op")
                skIButton.removeClass("skip-active");
            }

            if (sec >= ed) {
                if (Math.max(...seasonEp.map((ep) => ep.index)) === ep.index) {
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
            const currentTimeInSeconds = Math.floor(sec)
            if(currentTimeInSeconds%60===0&&!lastLoggedTime.includes(currentTimeInSeconds)){
                postLog(ani,true,ep._id,sec)
                lastLoggedTime.push(currentTimeInSeconds);
            }
        }
        plyr.elements.container?.addEventListener("timeupdate",handleTimeUpdate)
        const lastLoggedTime:number[] = [];
    }

    useEffect(()=>{
        initPlyr()
    },[])
    return(
        <Plyr source={{type:"video",sources:[]}} ref={ref} ></Plyr>
    )
}
export default Player