import React, {useEffect} from "react";
import {formatCaptionText, loadVTT} from "../functions/captionsFunctions";
import {VTTData,Cue} from "webvtt-parser";

interface props{
    epId:string,
    seasonId:string,
    aniId:string,
    selectedCaptions: string;
    currentCue: Cue[];
    cueData:VTTData|undefined;
    setCueData: React.Dispatch<React.SetStateAction<VTTData | undefined>>
}
const Captions:React.FC<props> = ({
    epId,
    seasonId,
    aniId,
    selectedCaptions,
    currentCue,
    cueData,
    setCueData,
    }) =>{
    useEffect(() => {
        loadVTT(aniId,seasonId,epId,selectedCaptions,setCueData)
    }, []);

    return (
        <div className='captions'>
            {currentCue.map(v=>(
                <span
                    className='caption'
                    key={v.startTime}
                    dangerouslySetInnerHTML={{__html:formatCaptionText(v.text)}}
                />
            ))}
        </div>
    )
}
export default Captions;
