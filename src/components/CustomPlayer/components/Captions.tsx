import React, {useEffect, useRef} from "react";
import {formatCaptionText, loadVTT} from "../functions/captionsFunctions";
import {VTTData,Cue} from "webvtt-parser";

interface props{
    epId:string,
    seasonId:string,
    aniId:string,
    selectedCaptions: string;
    currentCue: Cue[];
    cueData:VTTData|undefined;
    setCueData: React.Dispatch<React.SetStateAction<VTTData | undefined>>;
    captionsActive: boolean;
}
const Captions:React.FC<props> = ({
    epId,
    seasonId,
    aniId,
    selectedCaptions,
    currentCue,
    cueData,
    setCueData,
    captionsActive,
    }) =>{
    const captionsContainerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        loadVTT(aniId,seasonId,epId,selectedCaptions,setCueData)
    }, [selectedCaptions]);

    useEffect(() => {
        if (captionsContainerRef.current) {
            // Limpa todo o conteúdo do container antes de adicionar novos
            captionsContainerRef.current.innerHTML = '';
        }
        if(captionsActive){
            currentCue.forEach(cue => {
                const span = document.createElement('span');
                span.className = 'caption';
                span.innerHTML = formatCaptionText(cue.text);
                captionsContainerRef.current?.appendChild(span);
            });
        }
    }, [currentCue]);

    return (
        <div className='captions' ref={captionsContainerRef}>
        </div>
    )
}
export default Captions;
