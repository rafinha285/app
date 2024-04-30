import React, { useContext, useEffect, useState} from "react";
import {Anime, Season} from "../types/animeModel";
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
import {Box, Rating} from "@mui/material"
import StarIcon from '@mui/icons-material/Star';
import { genToArray, tupleToProducer, tupleToSeason } from "../functions/animeFunctions";
import AniProducers, { prodType } from "../assets/AnimeProd";
import { types } from "cassandra-driver";
import { Episode } from "../types/episodeModel";
import GlobalContext from "../GlobalContext";


interface seasonDate{
    month:number,
    year:number,
    season:string
}

const AnimePage:React.FC = ()=>{
    const context = useContext(GlobalContext)!
    const {id} = useParams()
    const [ani,setAni] = useState<Anime |null>(null)
    const [err,setErr] = useState<boolean>(false)
    const [seasonD,setSeasonD] = useState<seasonDate>()
    const [episodes,setEpisodes] = useState<Episode[]>([])
    useEffect(()=>{
        if(!ani){
            $.ajax(`/api/ani/${id}`).done((res:Anime)=>{
                const animeData:Anime = res
                setAni(animeData)
            }).fail((e:any)=>{
                if(e.status === 400){
                    setErr(true)
                }
            })
        }
        if(ani){
            // postLog(ani,false)
            setGen(ani.genre)
            ani.seasons = tupleToSeason(ani.seasons as types.Tuple[])
            console.log(ani.seasons)
            ani.seasons?.forEach((season)=>{
                season.episodes?.forEach(async ep=>{
                    const response = await fetch(`/api/g/eps/${ani!.id}/${season.id}/${ep}`)
                    if (response.ok) {
                        const data = await response.json();
                        // Aqui você pode fazer algo com os episódios, como atualizar o estado ou armazená-los de alguma forma
                        console.log(`Episódios da temporada ${season.id}:`, data);
                        setEpisodes((prevEpisodes) => [...prevEpisodes, data]);
                        if(context.isLogged){
                            fetch("/api/")
                        }
                    } else {
                        throw new Error(`Erro ao buscar episódios da temporada ${season.id}`);
                    }
                })
                
            })
        }
    },[ani,id])
    const [gen,setGen] = useState<string[]>([])
    // useEffect(()=>{
    //     console.log(ani?.releaseDate,ani)
        
    //     // $.ajax({
    //     //     url:`/api/ani/season/?month=${ani?.releaseDate.getMonth()}&year=${ani?.releaseDate.getFullYear()}`,
    //     //     headers:{
    //     //         "GetCurrentSeason":'false'
    //     //     }
    //     // }).done((res:seasonDate)=>{
    //     //     setSeasonD(res)
    //     // })
    // },[])
    // (ani?.seasons! as Season[])
    // const [epsComponent,setEpsComponent] = useState<React.Component[]>()
    
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
    const ratingLabel:{[index:string]:string} ={
        0.5:"PUTA QUE PARIU",
        1:"Horrivel",
        1.5:"Muito Ruim",
        2:"Ruim",
        2.5:"Na Média",
        3:"Ok",
        3.5:"Bom",
        4:"Muito Bom",
        4.5:"Incrivel",
        5:"Obra-prima"
    }
    function getLabelText(value: number) {
        return `${value} Star${value !== 1 ? 's' : ''}, ${ratingLabel[value]}`;
    }
    const handleRatingValue = async(value:number) =>{
        if(!context.isLogged){
            alert("Nenhuma conta conectada")
            return null
        }
        const response = await fetch(`/api/user/anime/${ani!.id}`)
            .then(response =>response.json());
        
    }
    const handleAddAnimeToList = async()=>{

    }
    const [ratingValue,setRatingValue] = useState<number|null>()
    const [ratingHover,setRatingHover] = useState(-1)
    console.log(ani)
    return(
        <html lang="pt-BR">
            <Helmet>
                    <title>Anime foda: {ani?.name}</title>
            </Helmet>
            <Header />
            {ani?(
                <div className="cont container" style={{padding:"100px"}}>
                    <p style={{fontSize:".7rem !important"}}>Anime - Duração: <span style={{fontSize:".7rem !important"}} id="aniLen">{getEpTime(ani.averageeptime!)}</span><i className="fa-regular fa-clock"></i></p>
                    <div className="contentL">
                        <h2>{ani.name}</h2>
                        <div className="dura">
                            <p style={{fontSize:".7rem !important",display:"inline-block"}}>Ano: {new Date(ani.releasedate).getFullYear()} &emsp;</p>
                            <p style={{fontSize:".7rem !important",display:"inline-block"}}>Qualidade: {ani.quality}</p>
                        </div>
                        <LikeButton />
                        <div>
                            <p style={{fontSize:"0.8rem"}}>{ani.description}</p>
                        </div>
                        <div style={{marginBottom:"1em"}}>
                            <p style={{display:"inline"}}>Generos:</p>
                            <div style={{display:"inline"}}>
                                {gen.map((v,i)=>(
                                    <AniGeneros
                                        genre={v}
                                        index={i}
                                    />
                                ))}
                            </div>
                        </div>
                        <div style={{marginBottom:"1em"}}>
                            <p style={{display:"inline"}}>Produtores: </p>
                            <div style={{display:"inline"}}>
                                {tupleToProducer(ani.producers).map((v,i)=>(
                                    <AniProducers prod={v} index={i} typee={prodType.prod}/>
                                ))}
                            </div>
                        </div>
                        <div style={{marginBottom:"1em"}}>
                            <p style={{display:"inline"}}>{tupleToProducer(ani.creators).length>1?"Criador: ":"Criadores: "}</p>
                            <div style={{display:"inline"}}>
                                {tupleToProducer(ani.creators).map((v,i)=>(
                                    <AniProducers prod={v} index={i} typee={prodType.crea}/>
                                ))}
                            </div>
                        </div>
                        <div style={{marginBottom:"1em"}}>
                            <p style={{display:"inline"}}>Studios: </p>
                            <div style={{display:"inline"}}>
                                {tupleToProducer(ani.studios).map((v,i)=>(
                                    <AniProducers prod={v} index={i} typee={prodType.stud}/>
                                ))}
                            </div>
                        </div>
                        <div className="aniContent">
                            {ani.name2?(<p>Nome Alternativo: <span style={{fontSize:"18px !important"}}>{ani.name2}</span></p>):(<></>)}
                            {/* <p>Season: <span>{seasonD?.season}</span>de <span>{seasonD?.year}</span></p> */}
                            <p>Idioma: <span>{ani.language}</span></p>
                            <p>Data de lançamento: <span><b>{new Date(ani.releasedate).getDate().toString()}</b> de <b>{getMonthName(new Date(ani.releasedate),false)}</b> de <b>{new Date(ani.releasedate).getFullYear().toString()}</b></span></p>
                        </div>
                    </div>
                    <div className="contentR">
                        <div className="im">
                            <img src={`/api/ani/img?Id=${ani.id}`} alt={ani.name} />
                        </div>
                        <Box sx={{p:"auto",border:"1px white solid",borderRadius:'5px'}} className="not">
                            {/* <select className="selectN">
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
                            <button className="aniSNota"><i className="fa-solid fa-star" style={{float:"none"}}></i> Submit</button> */}
                            <Rating
                                className="rating"
                                name="rating"
                                defaultValue={0}
                                value={ratingValue}
                                precision={1}
                                getLabelText={getLabelText}
                                onChange={(event,newValue)=>{
                                    handleRatingValue(newValue!)
                                }}
                                onChangeActive={(event, newHover) => {
                                    setRatingHover(newHover);
                                }}
                                emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                                size="large"
                            />
                            {ratingValue!== null&&(
                                <Box sx={{ml:2,color:"white"}}>{ratingLabel[ratingHover! !== -1?ratingHover!:ratingValue!]}</Box>
                            )}
                        </Box>
                        <button className="addAnimeList" onClick={handleAddAnimeToList}>Adicionar a lista de anime</button>
                    </div>
                    <div className="seasons">
                        <select onChange={seasonChangeHandle}>
                            {(ani.seasons! as Season[])?.sort((a,b)=>a.index-b.index).map((s)=>(
                                <option value={s.id} key={s.index}>{s.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="eps">
                        {(ani.seasons as Season[])?.map((season,i,arr)=>(
                            <div style={{display:season.index === Math.min(...arr.map(v=>v.index))?"block":"none"}} id={season.id} key={season.index}>
                                {episodes.filter((episodes)=>episodes.seasonid == season.id)?.sort((a,b)=>a.epindex - b.epindex).map((ep)=>{
                                    // console.log(episodes.filter((episodes)=>episodes.seasonid == season.id))
                                    console.log(ep.name,ep.epindex)
                                    return <EpisodeLink ani={ani} s={season} ep={ep} key={ep.epindex}/>
                                })}
                            </div>
                        ))}
                        {/* {(ani.seasons! as Season[])?.map((s)=>(
                            <div style={{display: s.index === 1?'block':"none"}} id={s.id} key={s.index}>
                                {s.episodes?.map((ep,i)=>{
                                    return(<EpisodeLink ep={ep} s={s} ani={ani} key={i}></EpisodeLink>)
                                })}
                            </div>
                        ))} */}
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
                            <PersoCompo perso={v} aniId={ani.id} key={i}></PersoCompo>
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