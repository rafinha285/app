import {quality} from "../../../types/types";

export type localstorageFunctionsType = 'quality'| 'volume' | 'speed' | 'muted'|'captions';

export function getPlayerLocalstorage(type:localstorageFunctionsType):quality|string|boolean|null{
    let value = localStorage.getItem(`player-${type}`)
    if(value){
        if(type === 'quality') {
            return parseInt(value) as quality;
        }else{
            return value;
        }
    }
    return value;
}
export function setPlayerLocalstorage(type:localstorageFunctionsType,v:string|boolean|number){
    localStorage.setItem(`player-${type}`,v.toString());
}
