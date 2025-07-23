import React from "react";
import {Params} from "react-router-dom";
import {AxiosResponse} from "axios";
import ResponseType from "../types/ResponseType.ts";
import {Anime} from "../types/Anime.ts";
import {getFromApi} from "../functions/requestFunctions.ts";

export type BaseProps = {
    params: Params
}

export interface BaseState {
    err:boolean,
    errReason:string|null,
}

abstract class BasePage<P extends BaseProps, S extends BaseState> extends React.Component<P, S>{

    state!: S

    public constructor(props: P) {
        super(props);
    }

    protected getError() {
        return <h1>Erro ao carregar a página: {this.state.errReason}</h1>;
    }

    protected idNotFound(type: string) {
        this.setState({
            ...this.state,
            err: true,
            errReason: `${type} não encontrado`,
        });
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