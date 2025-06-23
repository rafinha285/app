import {languages} from "../types/Episode"


export function DateToStringLocal(dat:Date){
    let date:Date = new Date(dat)
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // O mês é baseado em zero
    const year = date.getFullYear();
    console.log(`${day}/${month}/${year}`)

  // Retorna a data formatada como uma string
  return `${day}/${month}/${year}`;
}


