import React from "react";
import "../css/index.css"
import "../css/base.css"

const Footer = () =>{
    var googleStyle ={
        
    }
    return(
        <footer className="main-footer">
            <p>Anime foda</p>
            <p style={{
                display:"flex"
            }}>Baixe agora:&emsp;<i className="fa-brands fa-google-play"></i></p>
            <div>
                <a href="/"><span>Home</span></a>
                <a href="/contato"><span>Contato</span></a>
            </div>
        </footer>
    )
}

export default Footer;