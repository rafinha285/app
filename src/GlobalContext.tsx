import React, { createContext, ReactNode, useEffect, useState } from "react";
// import jwt from 'jsonwebtoken';

interface GlobalContextType {
    isLogged: boolean;
}
const GlobalContext = createContext<GlobalContextType | undefined>(undefined);
const getCookie = (name: string): string | null => {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split('=');
      if (cookieName.trim() === name) {
        return cookieValue;
      }
    }
    return null;
};
export const GlobalProvider:React.FC<{children:ReactNode}> = ({children}) =>{
    const [isLogged, setIsLogged] = useState<boolean>(false)
    // const token = getCookie('token');
    useEffect(() => {
        const token = getCookie('token');
        setIsLogged(!!token); // Verifica se o token existe e define o estado de isLogged
    }, []); 
    
    return(
        <GlobalContext.Provider value={{isLogged}}>
            {children}
        </GlobalContext.Provider>
    )
}
export default GlobalContext;