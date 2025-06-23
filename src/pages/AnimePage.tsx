import React, { useContext, useEffect, useState} from "react";
import {Anime, AnimeUser} from "../types/Anime";
import "../css/index.css"
import "../css/base.css"
import "../css/anime.css"
import "../css/anime_.css"
import "../css/loading.css"
import { checkIsLogged, fetchUser, getEpTime, getMonthName} from "../features/main";
import LikeButton from "../assets/LikeButton"
import AniGeneros from "../assets/Animegenre";
import { useParams } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { Helmet } from "react-helmet";
import Loading from "../components/Loading";
import EpisodeLink from "../assets/EpisodeLink";
import AniProducers, { prodType } from "../assets/AnimeProd";
import { useCookies } from "react-cookie";
import {Episode, EpisodeUser} from "../types/Episode";
import GlobalContext from "../GlobalContext";
import Popup from "reactjs-popup"
import AnimeEditList from "../components/User/AnimeEditList";
import {apiUrl, cdnUrl} from "../const";
import Rating from "../components/Anime/Rating";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faClock} from "@fortawesome/free-regular-svg-icons";
import {faPlus, faStar} from "@fortawesome/free-solid-svg-icons";
import Comments from "../components/comments/Comments";
import CharacterDiv from "../components/Anime/CharacterDiv";
import {Character} from "../types/Character";
import {Producer} from "../types/types";
import {Season} from "../types/Season";
import ResponseType from "../types/ResponseType";


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
    interface EpisodeListState{
        [seasonId:string]: EpisodeUser[]
    }
    const [episodesWatched,setEpisodesWatched] = useState<EpisodeListState>({})
    const [isInList,setIsInList] = useState<boolean>(false)
    const [isPopupOpen,setIsPopupOpen] = useState<boolean>()
    const [seasons,setSeasons] = useState<Season[]>([])
    const [producers,setProducers] = useState<Producer[]>([])
    const [creators,setCreators] = useState<Producer[]>([])
    const [studios,setStudios] = useState<Producer[]>([])
    const [characters,setCharacters] = useState<Character[]>([])

    let checkList=async()=>{
        await fetchUser(`${apiUrl}/user/animelist/g/checklist/${ani?.id}`,"GET")
            .then(response=>response.json())
            .then(async data=>{
                setIsInList(data.success)
                await fetchUser(`/user/animelist/g/${ani?.id}`,"GET")
                    .then(response => response.json())
                    .then((data:{success:boolean,response:AnimeUser})=>{
                        setUserAni(data.response)
                        setRatingValue(data.response?.rate !== null?data.response?.rate.toString():'none')
                    })
            })
    }

    useEffect(()=>{
        if(!ani){
            fetch(`${apiUrl}/g/anime/${id}`).then(async res=>{
                if(!res.ok){
                    setErr(true)
                    return
                }
                const animeData:ResponseType<Anime> = await res.json()
                setAni(animeData.data)
            })
        }
        if(ani){
            // postLog(ani,false)
            setGen(ani.genre)
            const fetchPS = async()=>{
                await fetch(`${apiUrl}/g/details/${ani.id}`)
                    .then(response=>response.json())
                    .then((data:ResponseType<{
                        producers:Producer[],
                        creators:Producer[],
                        studios:Producer[]
                    }>)=>{
                        // console.log(data)
                        setCreators(data.data.creators)
                        setProducers(data.data.producers)
                        setStudios(data.data.studios)
                    })
                await fetch(`/ani/g/seasons/${ani.id}`)
                    .then(response =>response.json())
                    .then(data=>{
                        data.forEach(async (element:Season) => {
                            const fetchedEps = await fetchEp(ani,element)
                            const fetchedEpsList = await fetchEpList(ani,element)
                            setEpisodes(prev=>({...prev,[element.id]:fetchedEps}))
                            setEpisodesWatched(prev=>({...prev, [element.id]:fetchedEpsList}))
                        });
                        setSeasons(data)
                    })
                await fetch(`/ani/g/characters/${ani.id}`)
                .then(response=>response.json())
                    .then((data:{success:boolean,data:Character[]})=>{
                        setCharacters(data.data)
                    })
            }
            fetchPS()
            if(sessionStorage.getItem("token")){
                setCookie('token', sessionStorage.getItem("token"), { path: '/' });
            }
            if(context.isLogged){
                checkList()
            }
        }
    },[ani,id])
    const [gen,setGen] = useState<string[]>([])

    const seasonChangeHandle = (e: React.ChangeEvent<HTMLSelectElement>) =>{
        var s = e.target.value
        const epsElements = document.querySelectorAll<HTMLElement>(".eps > div");
        epsElements.forEach(element=>{
            const id = element.id
            if(id === s){
                element.style.display="block"
            }else{
                element.style.display="none"
            }
        })
    }

    const handleWatched = () =>{
        if(ani){
            seasons.forEach(async element=>{
                const fetchedEpsList = await fetchEpList(ani,element)
                setEpisodesWatched(prev=>({...prev, [element.id]:fetchedEpsList}))
            })
        }
    }

    const handleAddAnimeToList = async()=>{
        checkIsLogged(context.isLogged)
        const token = sessionStorage.getItem("token")
        // console.log(token)
        await fetchUser(`${apiUrl}/p/user/animelist/new/${ani?.id!}`,'POST')
            .then(res=>res.json())
            .then((data:ResponseType<string>)=>{
                // console.log(data)
                checkList()
            })
    }
    const fetchEp =async(ani:Anime,s:Season)=>{
        const res = await fetch(`/ep/g/season/${ani.id}/${s.id}`)
        const data: Episode[] = await res.json();
        return data
    }
    const fetchEpList = async(ani:Anime,s:Season)=>{
        const res = await fetchUser(`/ep/user/g/season/${ani?.id}/${s.id}`,"GET")
        let data:EpisodeUser[]
        if(!res.ok){
            return []
        }
        data = await res.json()
        console.log(data)
        return data;
    }
    const handleEditAnimePopup = async()=>{
        checkIsLogged(context.isLogged)
    }
    const handleLike = ()=>{

    }
    const [ratingValue,setRatingValue] = useState<string>()
    const [ratingHover,setRatingHover] = useState(-1)
    // console.log(ani)
    return(
        <html lang="pt-BR">
            <Helmet>
                    <title>Anime foda: {ani?.name}</title>
            </Helmet>
            <Header />
            {ani?(
                <div className="cont container" style={{padding:"100px"}}>
                    <p style={{fontSize:".7rem !important"}}>Anime - Duração: <span style={{fontSize:".7rem !important"}} id="aniLen">{getEpTime(ani.averageeptime!)}</span><FontAwesomeIcon icon={faClock}/></p>
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
                            <p>Estado: <span><b>{ani.state}</b></span></p>
                            <p>Nota: <span><b>{ani.rating}</b></span> <FontAwesomeIcon icon={faStar}/></p>
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
                            <button className="addAnimeList" onClick={handleAddAnimeToList}>Adicionar a lista de anime <FontAwesomeIcon icon={faPlus}/></button>
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
                                    <EpisodeLink
                                        ani={ani}
                                        s={season}
                                        ep={v}
                                        epList={episodesWatched[season.id].find(vEp => vEp.episode_id === v.id)} handleWatched={handleWatched}
                                        isLogged={context.isLogged}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                    <CharacterDiv characters={characters} aniId={ani.id}/>
                    {/*<ComementsDisqus indenx'tifier={ani.id} type={'Anime'} name={ani.name} />*/}
                    <Comments page_id={ani?.id}/>
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
