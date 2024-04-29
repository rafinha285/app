import React, { createContext, ReactNode, useState } from "react";
import jwt from 'jsonwebtoken';

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
    const token = getCookie('token');
    if(token){
        try{
            const decodeToken:any = jwt.decode(token)
            if(decodeToken){
                setIsLogged(true)
            }else{
                setIsLogged(false)
            }
        }catch(erro){
            setIsLogged(false)
        }
    }else{
        setIsLogged(false)
    }
    
    return(
        <GlobalContext.Provider value={{isLogged}}>
            {children}
        </GlobalContext.Provider>
    )
}
export default GlobalContext;