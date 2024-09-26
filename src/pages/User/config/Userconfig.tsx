import React, {useContext, useEffect, useState} from "react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import './css/user-config.css'
import globalContext from "../../../GlobalContext";
import {User} from "../../../types/userType";
import {fetchUser} from "../../../features/main";
import {useCookies} from "react-cookie";


const UserPageConfig:React.FC = () =>{
    const context = useContext(globalContext)!;
    const [cookie,setCookie,removeCookie] = useCookies(['token']);


    const [user, setUser] = useState<User>();
    const [email,setEmail] = useState<string>();
    const [name,setName] = useState<string>();
    const [surname,setSurname] = useState<string>();
    const [username,setUsername] = useState<string>();
    useEffect(() => {

        const fetchU = async () =>{
            await fetchUser(`/user/g/`,'GET').then(r=>r.json()).then((res:User)=> {
                setUser(res)
                console.log(res)
                setEmail(res.email)
                setName(res.name)
                setSurname(res.surname)
                setUsername(res.username)
            })
        }

        if(!context.isLogged){
            // sessionStorage.removeItem("token")
            // removeCookie('token');
            // window.location.href = '/login'
        }
        fetchU()
    }, []);
    return(
        <html>
            <Header/>
            <div className='main-config'>
                <div className='container'>
                    <div className={'innercontainer'}>
                        <p>Email</p>
                        <input value={email} onChange={(e) => setEmail(e.target.value)}/>
                    </div>
                    <div className={'innercontainer'}>
                        <p>Nome: </p>
                        <input value={name} onChange={(e) => setName(e.target.value)}/>
                    </div>
                    <div className={'innercontainer'}>
                        <p>Nome: </p>
                        <input value={surname} onChange={(e) => setSurname(e.target.value)}/>
                    </div>
                    <div className={'innercontainer'}>
                        <p>Username: </p>
                        <input value={username} onChange={(e) => setUsername(e.target.value)}/>
                    </div>
                </div>
            </div>
            <Footer/>
        </html>
    )
}
export default UserPageConfig
