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
export type StateType = "ONGOING" | "HIATUS" | "COMPLETED" | "CANCELED";