import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../css/download.css"
import { useParams } from "react-router-dom";
import EpDownloadButton from "../components/EpDownloadButton";

const Download:React.FC = () =>{
    const {id,seasonId,epId} = useParams()
    const [aniName,setAniName] = useState<string>()
    const [seasonName,setSeasonName] = useState<string>()
    const [epName,setEpName] = useState<string>()
    const [epReso,setEpReso] = useState<string[]>()
    interface response{
        aniName:string;
        seasonName:string;
        episodeName:string;
        episodeResolution:string[];
    }
    useEffect(()=>{
        $.ajax({
            url:`/api/g/aniD/${id}/${seasonId}/${epId}`
        }).done((res:response)=>{
            setAniName(res.aniName)
            setSeasonName(res.seasonName)
            setEpName(res.episodeName)
            setEpReso(res.episodeResolution)
        })
    },[!aniName,!seasonName,!epName,!epReso])
    const downloadHandle = (reso:string) =>{
        $.ajax({
            url:`/api/g/ep/download/${id}/${seasonId}/${epId}/${reso.split("x")[1]}`
        })
    }
    return(
        <html>
            <Header/>
            <div className="download-main">
                <div className="download-div">
                    <div className="main-download-title">
                        <h1>{aniName}</h1><br/>
                        <h2>{epName}</h2><br/>
                        <img alt={epName} src={`/api/ep/${id}/${seasonId}/${epId}/${epId}.jpg`}/>
                    </div>
                    <div className="main-download-content">
                        {epReso?.map((v,i)=>(
                            <EpDownloadButton reso={v} downloadHandle={(reso)=>downloadHandle(reso)} key={i}></EpDownloadButton>
                        ))}
                    </div>
                </div>
            </div>
            <Footer/>
        </html>
    )
}
export default Download