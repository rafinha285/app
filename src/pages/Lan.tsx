import React ,{useEffect,useState}from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet";
import { epLog } from "../types/logType";
import Episode from "../assets/Episode";

const LancamentosPage:React.FC = () =>{
    const [eps,setEps] = useState<epLog[]>()
    useEffect(()=>{
        $.ajax({
            method:"GET",
            url:`/api/g/eps`
        }).done((res)=>{
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
                        {eps?.map((v,i)=>(
                            <Episode ep={v}></Episode>
                        ))}
                    </div>
                </div>
            </div>
            <Footer></Footer>
        </html>
    )
}

export default LancamentosPage