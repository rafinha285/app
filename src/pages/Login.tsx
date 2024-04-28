import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import "../css/login.css"
import Cookies from "universal-cookie"
import axios from 'axios';

const cookies = new Cookies();
const Login:React.FC = ()=>{
    const [recaptchaValue,setRecaptchaValue] = useState<string|null>(null)
    const [error,setError] = useState<any|null>(null)
    let email:string
    let password:string
    
    const handleRecaptchaChange = (value: string | null) => {
        setRecaptchaValue(value);
        console.log(value)
    };
    const handleLogin = async()=>{
        if(recaptchaValue){
            try{
                const response = await axios.post("/login",{
                    email,
                    password,
                    recaptchaValue
                })
                const token = response.data.token
    
                cookies.set("token",token,{path:"/",maxAge:86400, secure: true})
                window.location.href = "/"
            }catch(err){
                console.log(err)
                setError(true)
            }
            
        }
    }
    enum enu{
        password,
        email
    }
    const handleChange = (e:React.ChangeEvent<HTMLInputElement>,ee:enu)=>{
        switch(ee){
            case enu.password:
                password = e.target.value
                break
            case enu.email:
                email = e.target.value
                break
        }
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
                    <input type="email" onChange={(e)=>handleChange(e,enu.email)}></input>
                </div>
                <div>
                    <span>Senha:</span>
                    <input type="password" onChange={e=>handleChange(e,enu.password)}></input>
                </div>
                <ReCAPTCHA sitekey="6LcHpccpAAAAAILEI6AF1tPIzD7z69E0Ia0RO42t" onChange={handleRecaptchaChange}></ReCAPTCHA>
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