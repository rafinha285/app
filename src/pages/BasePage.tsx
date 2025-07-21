import React from "react";
import {Params} from "react-router-dom";
import {AxiosResponse} from "axios";
import ResponseType from "../types/ResponseType.ts";
import {Anime} from "../types/Anime.ts";
import {getFromApi} from "../functions/requestFunctions.ts";

type Props = {
    params: Params
}

export type BaseState = {
    err:boolean,
    errReason:string,
}

abstract class BasePage<P extends Props, S extends BaseState> extends React.Component<P, S>{

    public constructor(props: P, initialState: S) {
        super(props);
        this.state = initialState;
    }

    protected getError(){
        return <h1>Erro ao carregar a pagina: {}</h1>
    }

    protected idNotFound(type:string){
        this.setState({
            err: true,
            errReason:`${type} não encontrado`
        })
    }

    protected async getAnime(id:string){
        try{
            const res:AxiosResponse<ResponseType<Anime>> = await getFromApi<Anime>(`/anime/${id}`, null)
            if(res.status !== 200){
                this.setState({err: true})
                return
            }
            return res.data.data
            // console.log(data)
            // this.setState({ani:data})
        }catch(e){
            console.log(e)
        }
    }
}

export default BasePage;