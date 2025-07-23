import {UserRole} from "../types/types";
import {postToApiWithToken} from "./requestFunctions.ts";
import {User} from "../types/User.ts";

export async function fetchPublicKey(){
    return await fetch("/public-key").then(r=>r.text())
}
//Usa o agente e a memoria para saber se é o dispositivo
export function getDeviceIndentifier() {
    const fingerprint = {
        userAgent:navigator.userAgent,
        timeZone:getTimeZone(),
        WegGl:getWebGLFingerprint()
    }
    return fingerprint
}
//Funções para pegar as coisas do digest
//mais facil pra debugar
function getWebGLFingerprint() {
    try {
        let canvas = document.createElement('canvas');
        let gl = canvas.getContext('webgl') as WebGLRenderingContext || canvas.getContext('experimental-webgl') as WebGLRenderingContext;

        if (!gl) return null;

        let debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
            let vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
            let renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
            return { vendor, renderer };
        }

        return null
    } catch (e) {
        return null;
    }
}
function getTimeZone() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function checkIsLogged(isLogged: boolean) {
    if (!isLogged) {
        alert("Nenhuma conta conectada")
        window.location.href = '/login/'
    }
}

export async function fetchPost(path: string, method: "POST" | "DELETE" | "PATCH" = "POST", body?: any) {
    return await fetch(path, {
        method: method,
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
    })
}
export function userHasRole(user: User, role: UserRole): boolean {
    return user.roles.some(r => r.name === role);
}

export async function refreshToken() {
    const data = await postToApiWithToken<{refreshToken: string},string>("user/refresh",{refreshToken:localStorage.getItem("refreshToken")!!})
    if(data.status !== 200){
        return
    }
    localStorage.setItem("accessToken", data.data.data)
}

// export const handlePostSec = async (context:GlobalContextType, ep:Episode, sec: number) => {
//     if (context.isLogged) {
//         let body = {
//             episode_id: ep?.id,
//             anime_id: ep?.animeId,
//             dropped_on: sec,
//             season_id: ep?.seasonId,
//         }
//         await fetchUser('/ep/user/p/', 'POST', body)
//     }
// }
// export async function getPrivileges():Promise<getPrivilegesInterface>{
//     let res= await getFromApiWithToken(`${apiUrl}/g/user`)
//     let response:{success:boolean,role:roles[],super:boolean} = await res.json()
//     return {role:response.role,super:response.super};
// }
