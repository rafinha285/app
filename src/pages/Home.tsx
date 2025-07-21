import React, {useContext, useEffect} from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AnimeLan from "../components/anime/AnimeLan";
import { Helmet} from "react-helmet"
import "../css/index.css"
import "../css/base.css"
import Episodes from "../components/Episodes";
import globalContext from "../GlobalContext.tsx";
const Home = () =>{
    const context = useContext(globalContext)
    useEffect(()=>{
        console.log(context);
    })
    return(
        <>
            <Helmet>
                <title>{`Anime foda`}</title>
            </Helmet>
            <body>
                <Header></Header>
                <Episodes count={8}></Episodes>
                <AnimeLan manga={false}></AnimeLan>
                {/* <AnimeLan manga={true}></AnimeLan> */}
                <Footer></Footer>
            </body>
        </>
    )
}
export default Home;
