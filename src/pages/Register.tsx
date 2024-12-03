import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import bcrypt from 'bcryptjs'
import "../css/login.css"
// import * as bcrypt from "bcrypt"
// import {pbkdf2, pbkdf2Sync} from "@react-native-module/pbkdf2"
import ReCAPTCHA from "react-google-recaptcha";
import { v4 as uuid } from "uuid";
import { fetchPost } from "../features/main";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
const salt = bcrypt.genSaltSync(10)
const Register:React.FC = ()=>{
    const [email,setEmail] = useState<string>("")
    const [name,setName] = useState<string>("")
    const [surname,setSurname] = useState<string>("")
    const [username,setUsername] = useState<string>("")
    const [birthDate,setBirthDate] = useState<Date>(new Date())
    const [s,setS] = useState<string>("")
    const [cs,setCs] = useState<string>("")
    const [recaptchaValue,setRecaptchaValue] = useState<string|null>(null)
    let send:boolean = false
    enum eeenum{
        email = "email",
        name = "name",
        surname = "surname",
        username = "username",
        birthDate = "birthDate",
        senha = "senha",
        csenha = "csenha"
    }
    const handleChange= (e:React.ChangeEvent<HTMLInputElement>,eenum:eeenum)=>{
        // console.log(eenum,e.target.value)
        switch(eenum){
            case eeenum.email:
                setEmail(e.target.value)
                break
            case eeenum.name:
                setName(e.target.value)
                break
            case eeenum.surname:
                setSurname(e.target.value)
                break
            case eeenum.username:
                setUsername(e.target.value)
                break
            case eeenum.birthDate:
                setBirthDate(new Date(e.target.value))
                break
            case eeenum.senha:
                setS(e.target.value)
                break
            case eeenum.csenha:
                setCs(e.target.value)
                break
        }
    }
    const handleRecaptchaChange = (value: string | null) => {
        setRecaptchaValue(value);
        console.log(value)
    };
    const handleSendAccount = async(e?:React.MouseEvent)=>{
        e?.preventDefault()
        if(recaptchaValue){
            if(email&&name&&surname&&username&&birthDate&&s&&cs&&!send){
                //var hashedPassword = pbkdf2Sync(s,_id,interations,32,"sha256").toString("hex")
                var hashedPassword = bcrypt.hashSync(s,salt)

                // var hashedPasswordConfirm = pbkdf2Sync(cs,_id,interations,32,"sha256").toString("hex")
                console.log(name,surname,s===cs)
                const emailRegex = /\S+@\S+\.\S+/;
                if(emailRegex.test(email)&&s == cs){
                    let response = await fetchPost("/user/p/new/user","POST",{
                            // _id,
                        name:name,
                        surname:surname,
                        email:email,
                        username:username,
                        birthDate:birthDate?.toISOString(),
                        password:hashedPassword,
                        recaptchaToken:recaptchaValue,
                        salt
                    })
                    if(response.ok){
                        window.location.href = '/login'
                    }
                }
            }
        }
    }
    return(
        <html lang="pt-BR">
            <Header></Header>
            <form action="">
                <div className="login" style={{height:"auto"}}>
                    <div className="div-flex">
                        <span>E-mail: </span><input type="email" onChange={(e)=>handleChange(e,eeenum.email)}></input><br/>
                        <span>Nome:</span><input onChange={(e)=>handleChange(e,eeenum.name)}></input><br/>
                        <span>Sobrenome: </span><input onChange={(e)=>handleChange(e,eeenum.surname)}></input><br/>
                        <span>Username: </span><input onChange={(e)=>handleChange(e,eeenum.username)}></input><br/>
                        <span>Data de Nascimento: </span><input type="date" onChange={(e)=>handleChange(e,eeenum.birthDate)}/><br/>
                    </div>
                    <div className="div-flex">
                        <span>Senha: </span><input type="password" onChange={(e)=>handleChange(e,eeenum.senha)}/><br/>
                        <span>Confirmar Senha: </span><input type="password" onChange={(e)=>handleChange(e,eeenum.csenha)}/><br/>
                    </div>
                    <ReCAPTCHA sitekey="6LcHpccpAAAAAILEI6AF1tPIzD7z69E0Ia0RO42t" onChange={handleRecaptchaChange}></ReCAPTCHA>
                    <div className="div-flex">
                        <button type="submit" onClick={handleSendAccount} disabled={send} className="logBut">Registrar-se <FontAwesomeIcon icon={faPlus}/></button>
                    </div>
                    
                </div>
            </form>
            <Footer></Footer>
        </html>
    )
}
export default Register
