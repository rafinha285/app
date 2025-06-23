import {cdnUrl} from "../../../const";
import React, {useEffect} from "react";
import {VTTData, WebVTTParser} from 'webvtt-parser';

const timeToSeconds = (time: string) => {
    const [hours, minutes, seconds] = time.split(':');
    return (
        parseFloat(seconds) +
        parseInt(minutes, 10) * 60 +
        (hours ? parseInt(hours, 10) * 3600 : 0)
    );
};
export async function loadVTT (
    aniId:string,
    seasonId:string,
    epId:string,
    selectedCaption:string,
    setCueMap: React.Dispatch<React.SetStateAction<VTTData | undefined>>
){
    // const response = await fetch();
    const response = await fetch(`/ep/g/caption/${aniId}/${seasonId}/${epId}/${selectedCaption}`);
    const vttText = await response.text();

    const parser = new WebVTTParser();
    const result = parser.parse(vttText);
    console.log(result);


    // const cues:Cue[] = result.cues.map(cue => ({
    //     startTime: cue.startTime,
    //     endTime: cue.endTime,
    //     text: cue.text
    // }));

    setCueMap(result)
};
export const formatCaptionText = (text: string) => {
    return text.replace(/\n/g, ' ');
};


