export enum Audio{
    DUB = "Dublado",
    LEG = "Legendado",
    BOTH = "Dublado/Legendado"
}
export enum languages{
    Japanese = 'ja',
    Portuguese = 'pt',
    English = 'en',
    Spanish = 'es',
}
export type quality = 1080 | 720 | 480 | -1;
export enum qualityEnum {
    FULLHD = '1080p',
    HD = '720p',
    SD = '480p',
}
export enum state{
    ONGOING="Lançando",
    HIATUS="Hiáto",
    COMPLETED="Completo",
    CANCELED= "Cancelado",
    NOTARING= "Não Lançado"
}
export enum userAnimeState{
    watching="Assistindo",
    completed="Completado",
    on_hold="Em espera",
    dropped="Desistido",
    plan_to_watch="Pretendo assistir"
}
export enum userMangaState{
    reading="Lendo",
    completed="Completado",
    on_hold="Em espera",
    dropped="Desistido",
    plan_to_read="Pretendo ler"
}
export enum roles{
    adm = "Administrador",
    client = "Cliente",
    creator = "Criador",
    developer = "Desenvolvedor",
}
export enum priorityValue{
    LOW="Baixa",
    MEDIUM="Media",
    HIGH="Alta"
}
export type StateType = "ONGOING" | "HIATUS" | "COMPLETED" | "CANCELED";
export const ratingLabel:{[index:string]:string} ={
    0.5:"PUTA QUE PARIU",
    1:"Horrivel",
    1.5:"Muito Ruim",
    2:"Ruim",
    2.5:"Na Média",
    3:"Ok",
    3.5:"Bom",
    4:"Muito Bom",
    4.5:"Incrivel",
    5:"Obra-prima"
}
