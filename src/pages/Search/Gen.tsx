import React, { useEffect ,useState} from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Searchh from "../../components/Searchh";
import { animeType} from "../../types/AnimeType";
import "../../css/search.css"
import $ from "jquery"
import { useParams , Link} from "react-router-dom";
import { Helmet } from "react-helmet";


const GenSearch = ()=>{
    var {gen} = useParams()
    const [gens,setGens] = useState<animeType[]>()

    useEffect(()=>{
        $.ajax(`/api/ani/gen/${gen}`)
            .done((res:animeType[])=>{
                setGens(res)
            })
    },[])
    return(
        <html lang="pt-BR">
            <Helmet>
                <title>Procurar genero: {gen}</title>
            </Helmet>
            <Header />
            <div>
                {gens?.map((genn,index)=>(
                    <Searchh ser={genn} key={index}></Searchh>
                ))}
            </div>
            <Footer />
        </html>
    )
}
export default GenSearch
