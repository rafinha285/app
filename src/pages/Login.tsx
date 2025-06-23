import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {Link, redirect} from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import "../css/login.css"
import Cookies from "universal-cookie"
import {
    getDeviceIndentifier
} from '../functions/userFunctions'
import { fetchPost } from "../features/main";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faRightToBracket} from "@fortawesome/free-solid-svg-icons";
import { apiUrl } from "../const";
import ResponseType from "../types/ResponseType";
import axios, {AxiosResponse} from "axios";

interface ResponseTokens{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}

const cookies = new Cookies();
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

                const userIndentifier = getDeviceIndentifier()
                const response = await fetchPost(`${apiUrl}/p/user/login`,"POST",{
                    email,
                    password,
                    recaptchaToken:recaptchaValue,
                    userAgent:userIndentifier.userAgent,
                    timeZone:userIndentifier.timeZone,
                    WebGLVendor:userIndentifier.WegGl?.vendor,
                    WebGLRenderer:userIndentifier.WegGl?.renderer
                })

                axios.post(`${apiUrl}/p/user/login`, {
                    email,
                    password,
                    recaptchaToken:recaptchaValue,
                    userAgent:userIndentifier.userAgent,
                    timeZone:userIndentifier.timeZone,
                    WebGLVendor:userIndentifier.WegGl?.vendor,
                    WebGLRenderer:userIndentifier.WegGl?.renderer
                }).then((res:AxiosResponse<ResponseType<ResponseTokens>>)=>{
                    const accessToken = res.data.data.accessToken;
                    const refreshToken = res.data.data.refreshToken;
                    cookies.set("token",accessToken,{path: "/", maxAge:res.data.data.expiresIn,secure:true});

                    localStorage.setItem("accessToken",accessToken);
                    localStorage.setItem("refreshToken",refreshToken);
                    console.log(res.data)
                    redirect("/")
                }).catch(err=>{
                    alert(err)
                })

                // if(response.ok&&(await response.json()).token){
                //     const res:ResponseType<ResponseTokens> = await response.json()
                //     const accessToken = res.data.accessToken;
                //     const refreshToken = res.data.refreshToken;
                //     cookies.set("token",accessToken,{path:"/",maxAge:86400, secure: true})
                //     // setCookie('token',token,{path:"/",maxAge:84600})
                //     localStorage.setItem("accessToken",accessToken)
                //     localStorage.setItem("refreshToken",refreshToken)
                // }else{
                //     alert('cu')
                // }
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
