import React, { createContext, ReactNode, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import {fetchUser} from "./features/main";
import {roles} from "./types/types";
import {getPrivileges} from "./functions/userFunctions";
import {User} from "./types/User";
import {apiUrl} from "./const";

export interface GlobalContextType {
    isLogged: boolean;
    isAdmin: boolean;
    isSuper: boolean;
    user:User|null
}
const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider:React.FC<{children:ReactNode}> = ({children}) =>{
    const [isLogged, setIsLogged] = useState<boolean>(false)
    const [isAdmin, setIsAdmin] = useState<boolean>(false)
    const [isSuper, setIsSuper] = useState<boolean>(false)
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState<boolean>(true);
    const [cookies,setCookies] = useCookies(['token']);
    // const token = getCookie('token');
    useEffect(() => {
        const fetchTest = async() =>{
            try {
                if(!localStorage.getItem('token')){
                    setIsLogged(false);
                    return;
                }
                setCookies('token',localStorage.getItem('accessToken')!)
                const userResponse = await fetchUser(`${apiUrl}/g/user/verify`, "GET");
                console.log(userResponse.json())
                const userData = await userResponse.json();
                setIsLogged(userData.success);
                if(userData.success){
                    let getUser:User= await (await fetchUser("/user/g/","GET")).json();
                    let privilegesData = await getPrivileges()
                    setIsAdmin(privilegesData.role.includes(roles.adm));
                    setIsSuper(privilegesData.super);
                    setUser(getUser);
                }else{
                    await fetchUser(`${apiUrl}/p/user/refresh`)
                }

            } catch (error) {
                console.error("Erro ao buscar dados:", error);
            } finally {
                setLoading(false);  // Concluído, desativa o estado de carregamento
            }
        }
        fetchTest()
        // console.log(sessionStorage.getItem("token"))
        // setIsLogged(!!(sessionStorage.getItem("token"))); // Verifica se o token existe e define o estado de isLogged
    }, [!(document.readyState === "complete")]);
    if (loading) {
        return <div>Loading...</div>;  // Você pode trocar por um componente de loading customizado
    }

    return(
        <GlobalContext.Provider value={{isLogged,isAdmin,isSuper,user}}>
            {children}
        </GlobalContext.Provider>
    )
}
export default GlobalContext;
