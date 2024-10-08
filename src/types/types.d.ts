export declare enum Audio {
    DUB = "Dublado",
    LEG = "Legendado",
    BOTH = "Dublado/Legendado"
}
export declare enum languages {
    Japanese = "ja",
    Portuguese = "pt",
    English = "en",
    Spanish = "es"
}
export type quality = 1080 | 720 | 480 | -1;
export declare enum qualityEnum {
    FULLHD = "1080p",
    HD = "720p",
    SD = "480p"
}
export declare enum state {
    ONGOING = "Lan\u00E7ando",
    HIATUS = "Hi\u00E1to",
    COMPLETED = "Completo",
    CANCELED = "Cancelado"
}
export declare enum userAnimeState {
    watching = "Assistindo",
    completed = "Completado",
    on_hold = "Em espera",
    dropped = "Desistido",
    plan_to_watch = "Pretendo assistir"
}
export declare enum userMangaState {
    reading = "Lendo",
    completed = "Completado",
    on_hold = "Em espera",
    dropped = "Desistido",
    plan_to_read = "Pretendo ler"
}
export declare enum roles {
    adm = "Administrador",
    client = "Cliente",
    creator = "Criador"
}
export declare enum priorityValue {
    LOW = "Baixa",
    MEDIUM = "Media",
    HIGH = "Alta"
}
export type StateType = "ONGOING" | "HIATUS" | "COMPLETED" | "CANCELED";
export declare const ratingLabel: {
    [index: string]: string;
};
