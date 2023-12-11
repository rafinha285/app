import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import "../css/login.css"


const Login:React.FC = ()=>{
    const handleLogin = ()=>{

    }
    return(
        <html lang="pt-BR">
            <Header></Header>
            <div className="login">
                <div style={{margin:"2.5em auto"}}>
                    <p>Login: </p>
                </div>
                <div>
                    <span>Email:</span>
                    <input type="email"></input>
                </div>
                <div>
                    <span>Senha:</span>
                    <input type="password"></input>
                </div>
                <div style={{display:"flex",justifyContent:"center",alignItems:"center",flexDirection:"column",margin:"0 auto"}}>
                    <button onClick={handleLogin} className="logBut">Entrar <i className="fa-solid fa-right-to-bracket"></i></button><br/>
                    <span>Criar conta:<Link to={"/register"}>Registrar-se</Link></span>
                </div>
                
            </div>
            <Footer></Footer>
        </html>
    )
}
export default Login