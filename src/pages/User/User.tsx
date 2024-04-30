import React, { useEffect, useState } from "react";
import {User} from "../../types/userType"
import "../../css/user.css"
import { DateToStringLocal } from "../../features/main";
import RoleDiv from "../../components/User/RoleDiv";
import { userAnimeState } from "../../types/types";

const UserPage:React.FC = () =>{
    const handleGetUser =async()=>{
        const token = sessionStorage.getItem('token');
        // let user:User
        const headers: HeadersInit ={
            'Authorization':`Bearer ${token}`
        }
        const response:User = await fetch("/api/user",{headers})
            .then(response => response.json())
            // .then((data:User)=>console.log(data))
            .catch((error:any)=>console.error('Error fetching user data:', error))

        setUser(response)
    }
    var [user,setUser] = useState<User>()
    useEffect(()=>{
        handleGetUser()
        console.log(user)
    },[])
    
    return(
        <>
            <div className="info">
                <div className="left">
                    <img className="user-img"></img>
                    <p className="user">Username: {user?.username}</p>
                    {/* DateToStringLocal(user?.birthDate!) */}
                    <p className='birth-date'>Data de Nascimento: {user?.birthDate?.toLocaleString("pt-br")}</p>
                </div>
                <div className="right">
                    <p>Nome: {user?.name}</p>
                    <p>Sobrenome: {user?.surname}</p>
                    <p>Email: {user?.email}</p>
                    <div className="role">
                        <p>Cargos: </p>
                        <div className="role-list">
                            {user?.role.map((v,i)=>(
                                <RoleDiv role={v} key={i}/>
                            ))}
                        </div>
                    </div>
                    <p>Anime</p>
                    <div className="anime-infos">
                        <p>Animes: {user?.totalanime}</p>
                        <p>Animes {userAnimeState.watching}: {user?.totalanimewatching}</p>
                        <p>Animes {userAnimeState.completed}: {user?.totalanimecompleted}</p>
                        <p>Animes {userAnimeState.on_hold}: {user?.totalanimeonhold}</p>
                        <p>Animes {userAnimeState.dropped}: {user?.totalanimedropped}</p>
                        <p>Animes {userAnimeState.plan_to_watch}: {user?.totalanimeplantowatch}</p>
                    </div>
                </div>
            </div>
            <div className="anime-list">
                <div className="content">
                    <h1>Lista de anime</h1>
                    <div className="list">

                    </div>
                </div>
            </div>
        </>
    )
}
export default UserPage