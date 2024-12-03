import { signInWithEmailAndPassword } from "firebase/auth";
import { fetchPost } from "../../../features/main";
import {getDeviceIndentifier} from "../../userFunctions"
import { CredentialResponse } from "@react-oauth/google";
import {auth} from "../firebaseApp"

export default async function sendAuth(
    credentialResponse: CredentialResponse,
    recaptchaValue:string
):Promise<{ok:boolean,token?:string}>{
    if(!credentialResponse.credential){
        return {ok:false}
    }
    try{
        const userToken = credentialResponse.credential; // Token JWT retornado pelo Google
        const userIdentifier = getDeviceIndentifier();
    
        // Envia os dados para o backend
        const res = await fetchPost("/api/auth/google-login", "POST", {
          token: userToken,
          recaptchaToken: recaptchaValue,
          userAgent: userIdentifier.userAgent,
          timeZone: userIdentifier.timeZone,
          WebGLVendor: userIdentifier.WegGl?.vendor,
          WebGLRenderer: userIdentifier.WegGl?.renderer,
        });
        if (res.ok) {
            alert("Logged in successfully!");
            return { ok: res.ok, token: (await res.json()).token };
          }
      
          return { ok: false };
    }catch(err){
        console.error("Error during Google login:", err);
        return { ok: false };
    }
}