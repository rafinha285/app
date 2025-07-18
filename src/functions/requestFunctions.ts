import axios, {AxiosResponse} from "axios";
import ResponseType from "../types/ResponseType";
import {apiUrl} from "../const";
import {getDeviceIndentifier} from "./userFunctions";

export async function getFromApi<T>(url:string, query: object|null):Promise<AxiosResponse<ResponseType<T>>>{
    try{
        const response = await axios.get<ResponseType<T>>(`${apiUrl}/g${url}`,{
            headers: {
                'Content-Type': 'application/json',
            },
            params: query,
        })

        if(response.status !== 200){
            throw new Error(response.data.message || 'Erro inesperado.');
        }

        return response;
    }catch(err){
        if(axios.isAxiosError(err)){
            throw new Error(err.response?.data.message||err.message);
        }else{
            throw err;
        }
    }
}

export async function getFromApiWithToken<T>(url:string):Promise<AxiosResponse<ResponseType<T>>>{
    try {
        let indentifier = getDeviceIndentifier()
        let accessToken = localStorage.getItem("accessToken")
        let response = await axios.get<ResponseType<T>>(`${apiUrl}/g${url}`,{
            headers: {
                'Content-Type': 'application/json',
                'timeZone': indentifier.timeZone,
                'webGlRenderer': indentifier.WegGl?.renderer,
                'webGlVendor': indentifier.WegGl?.vendor,
                'Authorization': `Bearer ${accessToken}`,
            },
        })
        if(response.status !== 200){
            throw new Error(response.data.message || 'Erro inesperado.');
        }
        return response
    }catch(err){
        if(axios.isAxiosError(err)){
            throw new Error(err.response?.data.message||err.message);
        }else {
            throw err;
        }
    }
}

export async function postToApi<T>(url:string,data:T):Promise<AxiosResponse<ResponseType<boolean>>>{
    try{
        const response = await axios.post<ResponseType<boolean>>(`${apiUrl}/p${url}`, data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.status !== 200) {
            throw new Error(response.data.message || 'Erro inesperado da API');
        }

        return response;
    }catch(error){
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data.message || error.message);
        } else {
            throw error;
        }
    }
}