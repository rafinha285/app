import React, { createContext, ReactNode, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
// import jwt from 'jsonwebtoken';

export interface GlobalContextType {
    isLogged: boolean;
}
const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider:React.FC<{children:ReactNode}> = ({children}) =>{
    const [isLogged, setIsLogged] = useState<boolean>(false)
    // const [cookies] = useCookies();
    // const token = getCookie('token');
    const [cookie,setCookie,removeCookie] = useCookies(['token'])
    useEffect(() => {
        console.log(sessionStorage.getItem("token"))
        setIsLogged((!!sessionStorage.getItem("token"))||(!!cookie)); // Verifica se o token existe e define o estado de isLogged
    }, [!(document.readyState === "complete")]);

    return(
        <GlobalContext.Provider value={{isLogged}}>
            {children}
        </GlobalContext.Provider>
    )
}
export default GlobalContext;
