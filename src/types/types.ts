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
export enum quality{
    FULLHD = "1080p",
    HD = "720p",
    SD = "480p"
}
export enum state{
	ONGOING="Lançando",
	HIATUS="Hiáto",
	COMPLETED="Completo",
	CANCELED= "Cancelado"
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
    creator = "Criador"
}
export enum priorityValue{
    LOW="Baixa",
    MEDIUM="Media",
    HIGH="Alta"
}
export type StateType = "ONGOING" | "HIATUS" | "COMPLETED" | "CANCELED";