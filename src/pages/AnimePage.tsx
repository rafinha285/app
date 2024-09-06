import React, { useContext, useEffect, useState} from "react";
import {Anime, AnimeUser, Producer, Season} from "../types/animeModel";
import "../css/index.css"
import "../css/base.css"
import "../css/anime.css"
import "../css/anime_.css"
import "../css/loading.css"
import { checkIsLogged, fetchUser, getEpTime, getMonthName} from "../features/main";
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
import StarIcon from '@mui/icons-material/Star';
import { genToArray, getLabelText, handleRatingValue, tupleToProducer, tupleToSeason } from "../functions/animeFunctions";
import AniProducers, { prodType } from "../assets/AnimeProd";
import { useCookies } from "react-cookie";
import { Episode } from "../types/episodeModel";
import GlobalContext from "../GlobalContext";
import Popup from "reactjs-popup"
import AnimeEditList from "../components/User/AnimeEditList";
import { ratingLabel } from "../types/types";
import {cdnUrl} from "../const";
import Rating from "../components/Anime/Rating";
import Comements from "../components/Comments";


interface seasonDate{
    month:number,
    year:number,
    season:string
}
const AnimePage:React.FC = ()=>{
    const context = useContext(GlobalContext)!
    const {id} = useParams()
    const [ani,setAni] = useState<Anime |null>(null)
    const [userAni,setUserAni] = useState<AnimeUser>()
    const [err,setErr] = useState<boolean>(false)
    const [seasonD,setSeasonD] = useState<seasonDate>()
    const [cookies,setCookie] = useCookies(['token'])
    interface EpisodeState{
        [seasonId:string]: Episode[]
    }
    const [episodes,setEpisodes] = useState<EpisodeState>({})
    const [isInList,setIsInList] = useState<boolean>(false)
    const [isPopupOpen,setIsPopupOpen] = useState<boolean>()
    const [seasons,setSeasons] = useState<Season[]>([])
    const [producers,setProducers] = useState<Producer[]>([])
    const [creators,setCreators] = useState<Producer[]>([])
    const [studios,setStudios] = useState<Producer[]>([])

    let checkList=async()=>{
        await fetchUser(`/user/animelist/checklist/${ani?.id}`,"GET")
            .then(response=>response.json())
            .then(async data=>{
                setIsInList(data.success)
                await fetchUser(`/user/animelist/${ani?.id}`,"GET")
                    .then(response => response.json())
                    .then((data:{success:boolean,response:AnimeUser})=>{
                        setUserAni(data.response)
                        setRatingValue(data.response.rate !== null?data.response.rate.toString():'none')
                    })
            })
    }

    useEffect(()=>{
        if(!ani){
            $.ajax(`/ani/g/${id}`).done((res:Anime)=>{
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
            const fetchPS = async()=>{
                await fetch(`/ani/g/prods/${ani.id}`)
                    .then(response=>response.json())
                    .then(data=>{
                        console.log(data)
                        setCreators(data.creators)
                        setProducers(data.producers)
                        setStudios(data.studios)
                    })
                await fetch(`/ani/g/seasons/${ani.id}`)
                    .then(response =>response.json())
                    .then(data=>{
                        data.forEach(async (element:Season) => {
                            const fetchedEps = await fetchEp(ani,element)
                            setEpisodes(prev=>({...prev,[element.id]:fetchedEps}))
                        });
                        setSeasons(data)
                    })
            }
            fetchPS()
            if(sessionStorage.getItem("token")){
                setCookie('token', sessionStorage.getItem("token"), { path: '/' });
            }
            // ani.seasons = tupleToSeason(ani.seasons as types.Tuple[])
            // console.log(ani.seasons)
            // ani.seasons?.forEach((season)=>{
            //     season.episodes?.forEach(async ep=>{
            //         const response = await fetch(`/api/g/eps/${ani!.id}/${season.id}/${ep}`)
            //         if (response.ok) {
            //             const data = await response.json();
            //             // Aqui você pode fazer algo com os episódios, como atualizar o estado ou armazená-los de alguma forma
            //             console.log(`Episódios da temporada ${season.id}:`, data);
            //             setEpisodes((prevEpisodes) => [...prevEpisodes, data]);
            //         } else {
            //             throw new Error(`Erro ao buscar episódios da temporada ${season.id}`);
            //         }
            //     })

            // })
            if(context.isLogged){
                checkList()
            }
        }
    },[ani,id])
    const [gen,setGen] = useState<string[]>([])

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


    const handleAddAnimeToList = async()=>{
        checkIsLogged(context.isLogged)
        const token = sessionStorage.getItem("token")
        console.log(token)
        await fetchUser(`/user/animelist/insert/${ani?.id!}`,'POST')
            .then(res=>res.json())
            .then((data)=>{
                console.log(data)
                checkList()
            })
    }
    const fetchEp =async(ani:Anime,s:Season)=>{
        const res = await fetch(`/ep/g/season/${ani.id}/${s.id}`)
        const data: Episode[] = await res.json();
        return data
    }
    const handleEditAnimePopup = async()=>{
        checkIsLogged(context.isLogged)

    }
    const handleLike = ()=>{

    }
    const [ratingValue,setRatingValue] = useState<string>()
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
                                {producers.map((v,i)=>(
                                    <AniProducers prod={v} index={i} typee={prodType.prod}/>
                                ))}
                            </div>
                        </div>
                        <div style={{marginBottom:"1em"}}>
                            <p style={{display:"inline"}}>{creators.length>1?"Criador: ":"Criadores: "}</p>
                            <div style={{display:"inline"}}>
                                {creators.map((v,i)=>(
                                    <AniProducers prod={v} index={i} typee={prodType.crea}/>
                                ))}
                            </div>
                        </div>
                        <div style={{marginBottom:"1em"}}>
                            <p style={{display:"inline"}}>Studios: </p>
                            <div style={{display:"inline"}}>
                                {studios.map((v,i)=>(
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
                            <img src={`${cdnUrl}/ani/img?Id=${ani.id}`} alt={ani.name} />
                        </div>
                        {
                            isInList?(
                                <Rating setRatingValue={setRatingValue} ratingValue={ratingValue} aniId={ani.id}/>
                            ):(<></>)
                        }
                            {/* <Rating
                                className="rating"
                                name="rating"
                                defaultValue={0}
                                value={ratingValue}
                                precision={0.5}
                                getLabelText={(v)=>getLabelText(v,ratingLabel)}
                                onChange={(event,newValue)=>{
                                    handleRatingValue(newValue!,context,ani)
                                }}
                                onChangeActive={(event, newHover) => {
                                    setRatingHover(newHover);
                                }}
                                emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                                size="large"
                            />
                            {ratingValue!== null&&(
                                <Box sx={{ml:2,color:"white"}}>{ratingLabel[ratingHover! !== -1?ratingHover!:ratingValue!]}</Box>
                            )}*/}
                        <Popup open={isPopupOpen} onClose={()=>setIsPopupOpen(false)}>
                            <AnimeEditList onClose={()=>setIsPopupOpen(false)} ani={userAni!}/>
                        </Popup>
                        {isInList?(
                            <button className="addAnimeList" onClick={()=>setIsPopupOpen(true)}>Editar Lista</button>
                        ):(
                            <button className="addAnimeList" onClick={handleAddAnimeToList}>Adicionar a lista de anime<i className="fa-solid fa-plus"></i></button>
                        )}
                    </div>
                    <div className="seasons">
                        <select onChange={seasonChangeHandle}>
                            {seasons.sort((a,b)=>a.index-b.index).map((s)=>(
                                <option value={s.id} key={s.index}>{s.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="eps">
                        {seasons.map((season,i,arr)=>(
                            <div style={{display:season.index === Math.min(...arr.map(v=>v.index))?"block":"none"}} id={season.id} key={season.index}>
                                {episodes[season.id]?.sort((a,b)=>a.epindex-b.epindex).map(v=>(
                                    <EpisodeLink ani={ani} s={season} ep={v}/>
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
                            <PersoCompo perso={v} aniId={ani.id} key={i}></PersoCompo>
                        ))}</div>
                    </div>
                    <Comements indentifier={ani.id} type={'Anime'} name={ani.name} />
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
