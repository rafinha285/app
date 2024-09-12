import React from "react";
import "../css/index.css"
import "../css/base.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGooglePlay} from "@fortawesome/free-brands-svg-icons";

const Footer = () =>{
    var googleStyle ={

    }
    return(
        <footer className="main-footer">
            <p>Anime foda</p>
            <p style={{
                display:"flex"
            }}>Baixe agora:&emsp;<FontAwesomeIcon icon={faGooglePlay}/></p>
            <div>
                <a href="/"><span>Home</span></a>
                <a href="/contato"><span>Contato</span></a>
            </div>
        </footer>
    )
}

export default Footer;
