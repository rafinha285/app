import React, { useEffect, useState } from "react";
import {User} from "../../types/userType"
import "../../css/user.css"
import { DateToStringLocal, fetchUser } from "../../features/main";
import RoleDiv from "../../components/User/RoleDiv";
import { userAnimeState, userMangaState } from "../../types/types";
import AnimeListDiv from "../../components/User/AnimeListDiv";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Helmet } from "react-helmet";
import { parseAnime } from "../../functions/animeFunctions";
import { AnimeUser } from "../../types/animeModel";

const UserPage:React.FC = () =>{
    let [animelist,setAnimelist] = useState<AnimeUser[]>([])
    const handleGetUser =async()=>{
        const token = sessionStorage.getItem('token');

        // let user:User
        const headers: HeadersInit ={
            'Authorization':`Bearer ${token}`
        }
        //,{headers}
        const check:{success:boolean} = await fetchUser("/user/g/verify","GET")
            .then(response=>response.json())
        if(check.success){
            await fetchUser("/user/g/","GET")
            .then(response => response.json())
            .then((data:User)=>{
                // animelist = data.animelist.map(parseAnime)
                setUser(data)
            })
            .catch((error:any)=>console.error('Error fetching user data:', error))
            await fetchUser("/user/animelist/",'GET')
                .then(response=>response.json())
                .then((data:AnimeUser[])=>{
                    setAnimelist(data)
                })
            // console.log(response)
        }else{
            sessionStorage.removeItem("token")
            window.location.href = '/login'
        }

    }
    var [user,setUser] = useState<User>()
    useEffect(()=>{
        handleGetUser()
        console.log(user)
    },[!user])

    return(
        <html>
            <Helmet>
                <title>Usuario: {user?.username}</title>
            </Helmet>
            <Header/>
            <div className="info">
                <div className="left">
                    {/*<img className="user-img"></img>*/}
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
                            {user?.role?.map((v,i)=>(
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
                    <p>Manga</p>
                    <div className="anime-infos">
                        <p>Mangas: {user?.totalmanga}</p>
                        <p>Mangas {userMangaState.reading}: {user?.totalmangareading}</p>
                        <p>Mangas {userMangaState.completed}: {user?.totalmangacompleted}</p>
                        <p>Mangas {userMangaState.on_hold}: {user?.totalmangaonhold}</p>
                        <p>Mangas {userMangaState.dropped}: {user?.totalmangadropped}</p>
                        <p>Mangas {userMangaState.plan_to_read}: {user?.totalmangaplantoread}</p>
                    </div>
                </div>
            </div>
            <div className="anime-list">
                <div className="content">
                    <h1>Lista de anime</h1>
                    <div className="list">
                        {(animelist||[])?.map((v,i)=>(
                            <AnimeListDiv ani={v} key={i}></AnimeListDiv>
                        ))}
                    </div>
                </div>
            </div>
            <Footer/>
        </html>
    )
}
export default UserPage
