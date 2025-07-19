import axios, {AxiosError, AxiosResponse} from "axios";
import {apiUrl} from "../const";
import ResponseType from "../types/ResponseType";
import {getDeviceIndentifier, refreshToken} from "./userFunctions";

export async function getFromApi<T>(url: string, headers: object | null = null): Promise<AxiosResponse<ResponseType<T>>> {
    try{
        const header = {
            "Content-Type": "application/json",
            ...headers
        }
        const response = await axios.get<ResponseType<T>>(`${apiUrl}/g${url}`,{
            headers: header
        });
        if(response.status !== 200){
            throw new AxiosError(response.data.message);
        }
        return response;
    }catch(err){
        throw err;
    }
}

export async function postToApi<T>(url: string, data: T, headers: object | null = null): Promise<AxiosResponse<ResponseType<T>>> {
    try{
        const header = {
            "Content-Type": "application/json",
            ...headers
        }
        const response = await axios.post<ResponseType<T>>(`${apiUrl}/p/${url}`, data,{
            headers:header
        })
        if(response.status !== 200){
            throw new AxiosError(response.data.message);
        }
        return response;
    }catch(err){
        throw err;
    }
}

export async function getFromApiWithToken<T>(url: string):Promise<AxiosResponse<ResponseType<T>>>{
    try{
        const identifier = getDeviceIndentifier()
        console.log(`${apiUrl}/g/${url}`)
        const response = await getFromApi<T>(`${apiUrl}/gy${url}`,{
            'timeZone': identifier.timeZone,
            'webGlRenderer': identifier.WegGl?.renderer,
            'webGlVendor': identifier.WegGl?.vendor,
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        })

        if(response.status !== 200){
            throw new AxiosError(response.data.message);
        }
        return response;
    }catch(err){
        throw err;
    }
}

export async function postToApiWithToken<T>(url: string, data: T):Promise<AxiosResponse<ResponseType<T>>>{
    try{
        const identifier = getDeviceIndentifier()
        const response = await postToApi<T>(`${apiUrl}/g/${url}`,data,{
            'timeZone': identifier.timeZone,
            'webGlRenderer': identifier.WegGl?.renderer,
            'webGlVendor': identifier.WegGl?.vendor,
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        })
        if(response.status !== 200){
            throw new AxiosError(response.data.message);
        }
        return response;
    }catch(err){
        throw err;
    }
}

export async function fetchUser(
    path: string,
    method: "POST" | "DELETE" | "PATCH" | "GET" = "POST",
    body?: any,
    retry: boolean = true
): Promise<Response> {
    let indentifier = getDeviceIndentifier()
    let response = await fetch(path, {
        method,
        headers: {
            'Content-Type': "application/json",
            'timeZone': indentifier.timeZone,
            'webGlRenderer': indentifier.WegGl?.renderer,
            'webGlVendor': indentifier.WegGl?.vendor,
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(body)
    })
    if (!response.ok && response.status === 401 && retry) {
        await refreshToken()
        response = await fetchUser(path, method, body, false)
    }
    return response
}