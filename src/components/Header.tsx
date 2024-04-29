import React,{ useContext, useState }  from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useCookies } from 'react-cookie';
import Cookies from "universal-cookie"
import "../css/index.css"
import "../css/base.css"
import GlobalContext from "../GlobalContext";
// import $ from 'jquery'

const cookies = new Cookies();
const Header = ()=>{
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate()

    const handleKeyPress = (event:React.KeyboardEvent<HTMLInputElement>)=>{
        if (event.key === "Enter"){
            navigate(`/search?s=${searchTerm}`)
        }
    }
    const handleInputChange = (event:React.ChangeEvent<HTMLInputElement>)=>{
        setSearchTerm(event.target.value)
    }

    const [searchVisible, setSearchVisible] = useState(false)
    const toggleSearch = ()=>{
        setSearchVisible(!searchVisible)
    }
    // const [cookies,setCookie,removeCookie] = useCookies(['token'])
    console.log(cookies.get("token"))
    const context = useContext(GlobalContext);
    if(!context){
        return <div>O contexto global não está definido</div>;
    }
    const {isLogged} = context
    console.log(isLogged)
    return(
        <header className="header">
            <nav>
                <a href="/" style={{
                    textDecoration: "none"
                }}>
                    <h1 style={{
                        cursor:"pointer"
                    }}>Anime foda</h1>
                </a>
                <ul className="nav_link">
                    <div className="dropdown">
                        <li><a href="">Animes</a></li>
                        <div className="dropdown-content">
                            <a href="/Anime/lancamentos">Lançamentos</a>
                            <a href="/Anime/seasons">Seasons</a>
                            <a href="/Anime/dublados">Dublados</a>
                            <a href="/Anime/legendados">Legendados</a>
                            <a href="/Anime/agenda">Agenda Lançamentos</a>
                        </div>
                    </div>
                    <li><a href="">Mangá</a></li>
                    <li>
                        <i className="fa-solid fa-magnifying-glass searc" onClick={toggleSearch}></i>
                        <input type="text" 
                        id="search" 
                        className={`search ${searchVisible?"show":""}`} 
                        onChange={handleInputChange} 
                        onKeyDown={handleKeyPress}
                        placeholder="Buscar..."
                        ></input>
                    </li>
                    <li>{isLogged?(
                        <Link to={'/user'}><i className="fa-solid fa-user"></i></Link>
                    ):(<Link to={"/login"}><i className="fa-solid fa-user"></i></Link>)}</li>
                </ul>
            </nav>
        </header>
    )
}

export default Header