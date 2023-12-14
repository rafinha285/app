import React, { useEffect, useState} from "react";
import {Anime, AnimeDocument} from "../types/animeModel";
import "../css/index.css"
import "../css/base.css"
import "../css/anime.css"
import "../css/anime_.css"
import "../css/loading.css"
import { getEpTime, getMonthName} from "../features/main";
import LikeButton from "../assets/LikeButton"
import AniGeneros from "../assets/Animegenre";
import { Link, useParams } from "react-router-dom";
import $ from 'jquery'
import Footer from "../components/Footer";
import Header from "../components/Header";
import { Helmet } from "react-helmet";
import Loading from "../components/Loading";
import EpisodeLink from "../assets/EpisodeLink";
import postLog from "../functions/logFunctions"
import PersoCompo from "../components/Perso";


interface seasonDate{
    month:number,
    year:number,
    season:string
}

const AnimePage:React.FC = ()=>{
    const {id} = useParams()
    const [ani,setAni] = useState<AnimeDocument |null>(null)
    const [err,setErr] = useState<boolean>(false)
    const [seasonD,setSeasonD] = useState<seasonDate>()
    useEffect(()=>{
        if(!ani){
            $.ajax(`/api/ani/${id}`).done((res)=>{
                const animeData:AnimeDocument = res
                setAni(animeData)
            }).fail((e)=>{
                if(e.status === 400){
                    setErr(true)
                }
            })
        }
        if(ani){
            // postLog(ani,false)
        }
    },[ani,id])
    $(function(){
        console.log(ani?.releaseDate,ani)
        // $.ajax({
        //     url:`/api/ani/season/?month=${ani?.releaseDate.getMonth()}&year=${ani?.releaseDate.getFullYear()}`,
        //     headers:{
        //         "GetCurrentSeason":'false'
        //     }
        // }).done((res:seasonDate)=>{
        //     setSeasonD(res)
        // })
    })
    const downloadHandle = () =>{
        
    }
    const seasonChangeHandle = (e:React.ChangeEvent) =>{
        var s = $(e.target).val()
        $(".eps").children().each(function(i,p){
            if($(p).attr("id") === s){
                $(p).css("display","block")
            }else{
                $(p).css("display","none")
            }
        })
    }
    return(
        <html lang="pt-BR">
            <Helmet>
                    <title>Anime foda: {ani?.name}</title>
            </Helmet>
            <Header />
            {ani?(
                <div className="cont container" style={{padding:"100px"}}>
                    <p style={{fontSize:".7rem !important"}}>Anime - Duração: <span style={{fontSize:".7rem !important"}} id="aniLen">{getEpTime(ani.averageEptime!)}</span><i className="fa-regular fa-clock"></i></p>
                    <div className="contentL">
                        <h2>{ani.name}</h2>
                        <div className="dura">
                            <p style={{fontSize:".7rem !important",display:"inline-block"}}>Ano: {new Date(ani.releaseDate).getFullYear()} &emsp;</p>
                            <p style={{fontSize:".7rem !important",display:"inline-block"}}>Qualidade: {ani.quality}</p>
                        </div>
                        <LikeButton />
                        <div>
                            <p style={{fontSize:"0.8rem"}}>{ani.description}</p>
                        </div><br/>
                        <div style={{marginBottom:"1em"}}>
                            <p style={{display:"inline"}}>Generos:</p>
                            <div style={{display:"inline"}}>
                                <AniGeneros genres={ani.generos}></AniGeneros>
                            </div>
                        </div><br></br>
                        <div className="aniContent">
                            {ani.name2?(<p>Nome Alternativo: <span style={{fontSize:"18px !important"}}>{ani.name2}</span></p>):(<></>)}
                            {/* <p>Season: <span>{seasonD?.season}</span>de <span>{seasonD?.year}</span></p> */}
                            <p>Idioma: <span>{ani.language}</span></p>
                            <p>Data de lançamento: <span><b>{new Date(ani.releaseDate).getDate().toString()}</b> de <b>{getMonthName(new Date(ani.releaseDate),false)}</b> de <b>{new Date(ani.releaseDate).getFullYear().toString()}</b></span></p>
                        </div>
                    </div>
                    <div className="contentR">
                        <div className="im">
                            <img src={`/api/ani/img?Id=${ani._id}`} alt={ani.name} />
                        </div>
                        <div className="not">
                            <select className="selectN">
                                <option value="none">Selecione sua nota</option>
                                <option value="10">(10) Obra-prima</option>
                                <option value="9">(9) Incrivel</option>
                                <option value="8">(8) Muito Bom</option>
                                <option value="7">(7) Bom</option>
                                <option value="6">(6) Ok</option>
                                <option value="5">(5) Na Média</option>
                                <option value="4">(4) Ruim</option>
                                <option value="3">(3) Muito Ruim</option>
                                <option value="2">(2) Horrivel</option>
                                <option value="1">(1) PUTA QUE PARIU</option>
                            </select>
                            <button className="aniSNota"><i className="fa-solid fa-star" style={{float:"none"}}></i> Submit</button>
                        </div>
                    </div>
                    <div className="seasons">
                        <select onChange={seasonChangeHandle}>
                            {ani.seasons?.map((s)=>(
                                <option value={s._id} key={s.index}>{s.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="eps">
                        {ani.seasons?.map((s)=>(
                            <div style={{display: s.index === 1?'block':"none"}} id={s._id} key={s.index}>
                                {s.episodes?.map((ep,i)=>(
                                    <EpisodeLink downloadHandle={downloadHandle} ep={ep} s={s} ani={ani}></EpisodeLink>
                                ))}
                            </div>
                        ))}
                    </div>
                    <div className="personagens">
                        <div style={{display:"flex",justifyContent:"space-between",marginBottom:"1em"}}>
                            <h1>Personagens: </h1>
                        </div>
                        <div style={{
                            border:"1px white solid",
                            padding:"1em",
                            display:"flex",
                            flexWrap:"nowrap",
                            justifyContent:"flex-start",
                            flexDirection:'row',
                            overflow:"auto"
                        }}>{ani.characters?.map((v,i)=>(
                            <PersoCompo perso={v} aniId={ani._id} key={i}></PersoCompo>
                        ))}</div>
                    </div>
                </div> 
                ):err?(
                    <div className="main-loading">
                        <h1>Anime não encontrado</h1>
                    </div>
                ):(
                    <Loading/>
                )}
            <Footer />
        </html>
    )
}
export default AnimePage