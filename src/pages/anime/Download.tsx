import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../css/download.css"
import { useParams } from "react-router-dom";
import EpDownloadButton from "../../components/EpDownloadButton";
import {Anime} from "../../types/Anime";
import {Episode} from "../../types/Episode";
import {cdnUrl} from "../../const";
import {Season} from "../../types/Season";

const Download:React.FC = () =>{
    const {id,seasonId,epId} = useParams()
    const [ani,setAni] = useState<Anime>()
    const [season,setSeason] = useState<Season>()
    const [ep,setEp] = useState<Episode>()
    interface response{
        aniName:string;
        seasonName:string;
        episodeName:string;
        episodeResolution:string[];
    }
    useEffect(()=>{
        fetch(`/ep/g/${id}/${seasonId}/${epId}`).then(async (res)=>{
            setEp(await res.json())
            fetch(`/ani/g/${id}`).then(async res=>{
                setAni(await res.json())
                fetch(`/ani/g/season/${id}/${seasonId}`).then(async res=>{
                    setSeason(await res.json())
                })
            })
        })
    },[])
    const downloadHandle = async(reso:string) =>{
        try{
            const response = await fetch(`${cdnUrl}/download/${id}/${seasonId}/${epId}/${reso.split("x")[1]}`)
            // console.log(response)
            if(!response.ok) throw new Error("Erro ao baixar Episodio");
            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url;
            link.setAttribute('download', `${ep?.name}.mp4`);
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
                    <h1>{ani?.name}</h1><br/>
                    <h2>{ep?.name}</h2>
                    <img className="download-img" alt={ep?.name} src={`${cdnUrl}/epPoster/${id}/${seasonId}/${epId}`}/>
                </div>
                <div className="main-download-content">
                    {ep?.resolution?.map((v, i)=> {
                    return (<EpDownloadButton reso={v} downloadHandle={(reso) => downloadHandle(reso)} key={i} />)
                    })}
                </div>
            </div>
            <Footer/>
        </html>
    )
}
export default Download
