import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AnimeLan from "../components/Anime/AnimeLan";
import { Helmet} from "react-helmet"
import "../css/index.css"
import "../css/base.css"
import Episodes from "../components/Episodes";
const Home = () =>{
    return(
        <html lang="pt-BR">
            <Helmet>
                <title>Anime foda</title>
            </Helmet>
            <body>
                <Header></Header>
                <Episodes count={8}></Episodes>
                <AnimeLan manga={false}></AnimeLan>
                {/* <AnimeLan manga={true}></AnimeLan> */}
                <Footer></Footer>
            </body>
        </html>
    )
}
export default Home;
