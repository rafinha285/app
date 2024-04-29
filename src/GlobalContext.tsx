import React, { createContext, ReactNode, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
// import jwt from 'jsonwebtoken';

interface GlobalContextType {
    isLogged: boolean;
}
const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider:React.FC<{children:ReactNode}> = ({children}) =>{
    const [isLogged, setIsLogged] = useState<boolean>(false)
    const [cookies] = useCookies();
    // const token = getCookie('token');
    useEffect(() => {
        
        console.log(cookies.token,cookies)
        setIsLogged(!!(cookies.token)); // Verifica se o token existe e define o estado de isLogged
    }, []); 
    
    return(
        <GlobalContext.Provider value={{isLogged}}>
            {children}
        </GlobalContext.Provider>
    )
}
export default GlobalContext;