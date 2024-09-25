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
    useEffect(() => {

        const fetchU = async () =>{
            await fetchUser(`/user/g/`,'GET').then(r=>r.json()).then((res:User)=> {
                setUser(res)
                console.log(res)
                setEmail(res.email)
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
                    <p>Email</p>
                    <input value={email} onChange={(e) => setEmail(e.target.value)}/>
                </div>
            </div>
            <Footer/>
        </html>
    )
}
export default UserPageConfig
