import React, { useEffect, useState } from "react";
import { useLocation} from "react-router-dom";
import Searchh from "../../components/Searchh";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Anime } from "../../types/Anime";
import {Helmet} from "react-helmet";

const MainSearch:React.FC =()=>{
    const location = useLocation()
    const searchParams = new URLSearchParams(location.search)
    const param = searchParams.get("s")

    const [sear,setSear] = useState<Anime[]>()
    console.log(param)
    useEffect(()=>{
        if (!param) return; // If param is falsy, return early
        fetch(`/ani/g/search/${param}`).then(res=>res.json())
        .then((data:Anime[])=>{
            setSear(data)
        })
    },[param])
    return(
        <html>
            <Helmet>
                <title>Procurar: {param}</title>
            </Helmet>
            <Header />
            <div>
                {sear?.map((sea,index)=>(
                    <Searchh ser={sea} key={index} />
                ))}
            </div>
            <Footer />
        </html>
    )
}

export default MainSearch
