import React, { createContext, ReactNode, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import {fetchUser} from "./features/main";
import {roles} from "./types/types";
import {getPrivileges} from "./functions/userFunctions";
// import jwt from 'jsonwebtoken';

export interface GlobalContextType {
    isLogged: boolean;
    isAdmin: boolean;
    isSuper: boolean;
}
const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider:React.FC<{children:ReactNode}> = ({children}) =>{
    const [isLogged, setIsLogged] = useState<boolean>(false)
    const [isAdmin, setIsAdmin] = useState<boolean>(false)
    const [isSuper, setIsSuper] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(true);
    // const [cookies] = useCookies();
    // const token = getCookie('token');
    useEffect(() => {
        const fetchTest = async() =>{
            try {
                const userResponse = await fetchUser(`/user/g/verify`, "GET");
                // console.log(userResponse)
                const userData = await userResponse.json();
                setIsLogged(userData.success);
                if(userData.success){
                    let privilegesData = await getPrivileges()
                    setIsAdmin(privilegesData.role.includes(roles.adm));
                    setIsSuper(privilegesData.super);
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
        <GlobalContext.Provider value={{isLogged,isAdmin,isSuper}}>
            {children}
        </GlobalContext.Provider>
    )
}
export default GlobalContext;
