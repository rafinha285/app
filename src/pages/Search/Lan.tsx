import React ,{useEffect,useState}from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Helmet } from "react-helmet";
import EpisodeComponent from "../../assets/EpisodeComponent.tsx";
import { EpisodeDTO } from "../../types/Episode";

const LancamentosPage:React.FC = () =>{
    const [eps,setEps] = useState<EpisodeDTO[]>()
    useEffect(()=>{
        fetch(`/ep/g/lan?count=20`).then(res=>res.json())
            .then(res=>{
                setEps(res)
            })
    },[!eps])

    return(
        <html>
            <Helmet>
                <title>Lançamentos</title>
            </Helmet>
            <Header></Header>
            <div>
                <div className="episodes">
                    <div style={{display:"flex"}}>
                        <h2>Episódios recem-adicionados</h2>
                    </div>
                    <div style={{display:"flex",padding:"1em",flexWrap:"wrap"}}>
                        {eps?.map((v)=>(
                            <EpisodeComponent ep={v}></EpisodeComponent>
                        ))}
                    </div>
                </div>
            </div>
            <Footer></Footer>
        </html>
    )
}

export default LancamentosPage
