import React, { useEffect ,useState} from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Searchh from "../../components/Searchh";
import { Anime} from "../../types/animeModel";
import "../../css/search.css"
import { useParams , Link} from "react-router-dom";
import { Helmet } from "react-helmet";


const GenSearch:React.FC = ()=>{
    var {gen} = useParams()
    const [gens,setGens] = useState<Anime[]>()

    useEffect(()=>{
        const fetchGens = () =>{
            fetch(`/ani/g/gen/${gen}`).then(async r=>{
                if(r.ok){
                    setGens(await r.json())
                }
            })
        }
        fetchGens()
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
