import {languages} from "../types/Episode";

declare global{
    interface Date{
        getDayOfWeekName():string;
        daysOfWeek(language?:languages):string[];
    }
}

interface MonthNames {
    [key: string]: string[];
}
const monthNames:MonthNames={
    'pt-br': [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ],
}
export const getMonthName = (date:Date,short:boolean,locale = "pt-br"):string =>{
    const month = date.getMonth();
    const localeMonthNames = monthNames[locale];

    if (!localeMonthNames) {
        return '';
    }

    return short ? localeMonthNames[month].substring(0, 3) : localeMonthNames[month];
}

export function DateToStringInput(dat:Date):string{
    let date:Date = new Date(dat)
    return date.toISOString().split("T")[0]
}

export function isToday(date:Date) {
    const today = new Date();

    return date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();
}


// eslint-disable-next-line no-extend-native
Date.prototype.getDayOfWeekName = function(){
    // const daysOfWeek = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    let daysOfWeek = Date.prototype.daysOfWeek()
    const dayOfWeek = this.getDay(); // Retorna um número de 0 (Domingo) a 6 (Sábado)
    return daysOfWeek[dayOfWeek];
}
// eslint-disable-next-line no-extend-native
Date.prototype.daysOfWeek = (language:languages = languages.Portuguese) =>{
    switch (language) {
        case languages.Portuguese:
            return ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
        case languages.English:
            return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        case languages.Spanish:
            return ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']; // Dias da semana em espanhol
        case languages.Japanese:
            return ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日']; // Dias da semana em japonês
        default:
            return ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado']; // Padrão para idioma português
    }
}