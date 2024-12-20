import React, { useEffect, useState } from "react";
import { AnimeSearch} from "../../types/animeModel";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Searchh from "../../components/Searchh";


const ProdSearch:React.FC<{type:'Produtor'|'Criador'|'Estudio'}> = ({type}) => {
    // const [prodsId,setProdsId] = useState<string[]>([])
    const location = useLocation()
    const prod = location.pathname.split("/").pop()
    const [anis,setanis] = useState<AnimeSearch[]>([])
    useEffect(()=>{
        const fetchAni = async()=>{
            switch(type){
                case "Produtor":
                    await fetch(`/ani/g/prod/${prod}`)
                        .then(response=>response.json())
                        .then(data=>setanis(data))
                    break
                case "Criador":
                    await fetch(`/ani/g/crea/${prod}`)
                        .then(response=>response.json())
                        .then(data=>setanis(data))
                    break
                case "Estudio":
                    await fetch(`/ani/g/stud/${prod}`)
                        .then(response=>response.json())
                        .then(data=>setanis(data))
                    break
            }
        }
        fetchAni()
    },[!anis])
    return(
        <html>
            <Helmet>
                <title>Procurar {type}</title>
            </Helmet>
            <Header/>
            {/*<div>*/}
            {/*    <p>Produtor: {prod}</p>*/}
            {/*</div>*/}
            <div>
                {anis.map((sea,index)=>(
                    <Searchh ser={sea} key={index}/>
                ))}
            </div>
            <Footer/>
        </html>
    )
}
export default ProdSearch
