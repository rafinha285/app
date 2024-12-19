import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import "../css/login.css"
import Cookies from "universal-cookie"
import {
    getDeviceIndentifier
} from '../functions/userFunctions'
// import { CookieSetOption } from "react-cookie";
// import { useCookies } from "react-cookie";
import axios from 'axios';
import { fetchPost } from "../features/main";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faRightToBracket} from "@fortawesome/free-solid-svg-icons";
// import { genSalt, hashSync } from "bcryptjs";

const cookiess = new Cookies();
const Login:React.FC = ()=>{
    const [recaptchaValue,setRecaptchaValue] = useState<string|null>(null)
    const [error,setError] = useState<any|null>(null)
    const [password,setPassword] = useState<string>()
    const [email,setEmail] = useState<string>()
    // const [cookies,setCookie,removeCookie] = useCookies()

    const handleRecaptchaChange = (value: string | null) => {
        setRecaptchaValue(value);
        console.log(value)
    };
    const handleLogin = async()=>{
        // if(recaptchaValue&&password&&email){
            try{
                // const salt = await genSalt(10)
                // const hashedPassword = hashSync(password,salt)
                // const publicKey = await fetchPublicKey();
                const userIndentifier = getDeviceIndentifier()
                // const encryptedData = encryptDataWithPublicKey(body)
                const response = await fetchPost(`/user/p/login`,"POST",{
                    email,
                    password,
                    recaptchaToken:recaptchaValue,
                    userAgent:userIndentifier.userAgent,
                    timeZone:userIndentifier.timeZone,
                    WebGLVendor:userIndentifier.WegGl?.vendor,
                    WebGLRenderer:userIndentifier.WegGl?.renderer
                })

                if(response.ok){
                    const token = (await response.json()).token
                    // console.log(token,response,response.headers["set-cookie"])
                    cookiess.set("token",token,{path:"/",maxAge:86400, secure: true})
                    // setCookie('token',token,{path:"/",maxAge:84600})
                    localStorage.setItem("token",token)
                    console.log(token)
                    window.location.href = "/"
                }else{
                    alert('cu')
                }
            }catch(err){
                console.log(err)
                setError(true)
            }

        // }
    }
    enum enu{
        password,
        email
    }
    const handleChange = (e:React.ChangeEvent<HTMLInputElement>,ee:enu)=>{
        switch(ee){
            case enu.password:
                setPassword(e.target.value)
                break
            case enu.email:
                setEmail(e.target.value)
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
                    <button onClick={handleLogin} className="logBut">Entrar <FontAwesomeIcon icon={faRightToBracket}/></button><br/>
                    <span>Criar conta:<Link to={"/register"}>Registrar-se</Link></span>
                </div>

            </div>
            <Footer></Footer>
        </html>
    )
}
export default Login
