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
    const downloadHandle = async(reso:string) =>{
        try{
            const response = await fetch(`/api/g/ep/download/${id}/${seasonId}/${epId}/${reso.split("x")[1]}`)
            if(!response.ok) throw new Error("Erro ao baixar Episodio");
            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url;
            link.setAttribute('download', `${epName}.mp4`);
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link);
        }catch(err){
            console.error(err)
        }
        
    }
    return(
        <html>
            <Header/>
            <div className="download-main">
                <div className="main-download-title">
                    <h1>{aniName}</h1><br/>
                    <h2>{epName}</h2>
                    <img className="download-img" alt={epName} src={`/api/ep/${id}/${seasonId}/${epId}/${epId}.jpg`}/>
                </div>
                <div className="main-download-content">
                    {epReso?.map((v,i)=>(
                        <EpDownloadButton reso={v} downloadHandle={(reso)=>downloadHandle(reso)} key={i}></EpDownloadButton>
                    ))}
                </div>
            </div>
            <Footer/>
        </html>
    )
}
export default Download