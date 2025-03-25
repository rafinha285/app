import React, { useEffect, useState} from "react";
import AnimePoster from "../../assets/AnimePosters"
import {Anime} from "../../types/Anime"
import "../../css/index.css"
import "../../css/base.css"
import { Link } from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {apiUrl} from "../../const";
import ResponseType from "../../types/ResponseType";


interface AnimeLanProps{
    manga:boolean
}
const AnimeLan:React.FC<AnimeLanProps> = ({manga}) =>{
    const [Aniposters,AnisetPosters] = useState<JSX.Element[]>([])
    const [Manposters,MansetPosters] = useState<JSX.Element[]>([])
    useEffect(()=>{
        console.log("aaa")
        fetch(`${apiUrl}/g/animes`).then((res)=>res.json())
        .then((data:ResponseType<Anime[]>)=>{
            console.log(data.data)
            const posterList = data.data?.map((anime:Anime,index:number)=>(
                <AnimePoster
                    key={index}
                    doc={anime}
                    aniId={anime.id}
                />
            ))
            AnisetPosters(posterList!)
            console.log(posterList)
        })
        .catch((err:any)=>{
            console.error(err)
        })
    },[])
    if(manga){
        return(
            <div className="newanime">
                <div className="newanimetitle">
                    <h2>Novos mangás adicionados</h2>
                    <Link to="/Manga/lancamentos" className="newMoreBut">
                        <span className="ui-icon-plusthic"></span>
                        <FontAwesomeIcon icon={faPlus}/>
                        Ver mais
                    </Link>
                </div>
                <div className="newanimein">{Manposters}</div>
            </div>
        )
    }else{
        return(
            <div className="newanime">
                <div className="newanimetitle">
                    <h2>Novos animes adicionados</h2>
                    <Link to="/Anime/lancamentos" className="newMoreBut">
                        <span className="ui-icon-plusthic"></span>
                        <FontAwesomeIcon icon={faPlus}/>
                        Ver mais
                    </Link>
                </div>
                <div className="newanimein">{Aniposters}</div>
            </div>
        )
    }

}

export default AnimeLan;
