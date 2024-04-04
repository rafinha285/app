import React, { useEffect, useState } from "react";
import { AnimeSearch} from "../../types/animeModel";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Searchh from "../../components/Searchh";


const ProdSearch:React.FC = () =>{
    // const [prodsId,setProdsId] = useState<string[]>([])
    const location = useLocation()
    const prod = location.pathname.split("/").pop()
    const [anis,setanis] = useState<AnimeSearch[]>([])
    useEffect(()=>{
        $.ajax({
            url:`/api/ani/prod/${prod}`
        }).done(res=>{
            setanis(res)
        })
    },[!anis])
    return(
        <html>
            <Helmet>
                <title>Procurar produtor</title>
            </Helmet>
            <Header/>
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