import React, {useEffect, useState} from "react";
import Header from "../../../components/Header";
import Footer from '../../../components/Footer';
import {Anime} from "../../../types/animeModel";
import IndexAdminAnime from "../components/index/IndexAdminAnime";
import {User} from "../../../types/userType";
import {fetchUser} from "../../../features/main";

const AdminIndex:React.FC = () =>{
    const [user,setUser] = useState<User>();
    const [animes,setAnimes] = useState<Anime[]>([]);
    useEffect(()=>{
        const fetchData = async() =>{
            await fetchUser(`/user/g/`,'GET')
                .then(response => response.json())
                .then((data:User)=>{
                    setUser(data)
                })
            await fetch("/ani/g/all")
                .then(response=>response.json())
                .then((d:Anime[])=>{
                    setAnimes(d);
                })
        }
    })
    return(
        <html>
            <Header/>
            <div className={'base-adm'}>
                <h1>Animes</h1>
                <div>
                    {animes.map((anime,index)=>(
                        <IndexAdminAnime user_id={user?._id!} anime={anime} key={index}/>
                    ))}
                </div>
            </div>
            <Footer/>
        </html>
    )
}
export default AdminIndex;
