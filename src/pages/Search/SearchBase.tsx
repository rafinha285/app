import {Anime} from "../../types/Anime.ts";
import React from "react";
import BasePage, {BaseState, BaseProps} from "../BasePage.tsx";
import {Producer} from "../../types/types.ts";

export type SearchParams ={
    search: string,
}

export interface SearchBaseProps extends BaseProps{
    params: SearchParams
}

export interface SearchBaseState extends BaseState{
    animes: Anime[]| Producer[]
}

abstract class SearchBase<P extends SearchBaseProps,S extends SearchBaseState> extends BasePage<P, S>{
    state !: S

}
export default SearchBase;