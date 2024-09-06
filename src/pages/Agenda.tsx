import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet";
import { AnimeAgenda } from "../types/animeModel";
import AgendComponent from "../components/Anime/AgendaComponent.tsx";

const Agenda:React.FC = () =>{
    const [anis,setAnis] = useState<AnimeAgenda[]>()

    useEffect(()=>{
        const fetchData = async() =>{
            var response = await fetch(`/ani/g/agenda`)
            setAnis(await response.json())
        }
        fetchData()
    },[!anis])
    return(
        <html>
            <Helmet>
                <title>Agenda de anime</title>
            </Helmet>
            <Header></Header>
            <div className="main-agenda">
                <div className="agenda-content">
                    {anis?.map((v,i)=>(
                        <AgendComponent ani={v}/>
                    ))}
                </div>
            </div>
            <Footer></Footer>
        </html>
    )
}
export default Agenda
