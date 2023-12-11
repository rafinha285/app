import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet";

const LancamentosPage:React.FC = () =>{
    return(
        <html>
            <Helmet>
                <title>Lançamentos</title>
            </Helmet>
            <Header></Header>
            <Footer></Footer>
        </html>
    )
}

export default LancamentosPage