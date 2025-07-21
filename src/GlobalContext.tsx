import React, {createContext, ReactNode, useEffect, useState} from "react";
import {useCookies} from "react-cookie";
import {User} from "./types/User";
import {getFromApiWithToken} from "./functions/requestFunctions";
import {userHasRole} from "./functions/userFunctions.ts";
import {UserRole} from "./types/types.ts";

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
        const getUser= async ()=>{
            const accessToken = localStorage.getItem("accessToken");
            const refreshToken = localStorage.getItem("refreshToken");
            if(accessToken){
                const userVerify = await getFromApiWithToken<null>("/user/verify");
                // console.log(userVerify)
                setIsLogged(userVerify.data.success);
                if(userVerify.data.success){
                    const user = await getFromApiWithToken<User>("/user/");
                    // console.log(user);
                    setUser(user.data.data)
                    setIsAdmin(userHasRole(user.data.data,UserRole.ADMIN))
                    setIsSuper(user.data.data.superuser)
                    setLoading(false)
                }
            }else if(refreshToken){
                const userVerify = await getFromApiWithToken<null>("/user/verify");
                setIsLogged(userVerify.data.success);
            }else{
                setIsLogged(false);
                setLoading(false)
                console.log("Erro ao carregar usuario")
            }
            // setLoading(false);
        }
        getUser()
        // const fetchTest = async() =>{
        //     try {
        //         if(!localStorage.getItem('token')){
        //             setIsLogged(false);
        //             return;
        //         }
        //         setCookies('token',localStorage.getItem('accessToken')!)
        //         const userResponse = await getFromApiWithToken(`${apiUrl}/g/user/verify`)
        //         const userData = userResponse.data;
        //         setIsLogged(userData.success);
        //         console.log(userData);
        //         if(userData.success){
        //             let getUser= await getFromApiWithToken<User>(`${apiUrl}/g/user/`)
        //             console.log(getUser.data);
        //             // setIsAdmin(privilegesData.role.includes(roles.adm));
        //             // setIsSuper(privilegesData.super);
        //             setUser(getUser.data.data);
        //         }else{
        //             await fetchUser(`${apiUrl}/p/user/refresh`)
        //         }
        //
        //     } catch (error) {
        //         console.error("Erro ao buscar dados:", error);
        //     } finally {
        //         setLoading(false);  // Concluído, desativa o estado de carregamento
        //     }
        // }
        // fetchTest()
        // console.log(sessionStorage.getItem("token"))
        // setIsLogged(!!(sessionStorage.getItem("token"))); // Verifica se o token existe e define o estado de isLogged
        //[!(document.readyState === "complete")]
    }, []);
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
