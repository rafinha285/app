"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ratingLabel = exports.priorityValue = exports.roles = exports.userMangaState = exports.userAnimeState = exports.state = exports.qualityEnum = exports.languages = exports.Audio = void 0;
var Audio;
(function (Audio) {
    Audio["DUB"] = "Dublado";
    Audio["LEG"] = "Legendado";
    Audio["BOTH"] = "Dublado/Legendado";
})(Audio || (exports.Audio = Audio = {}));
var languages;
(function (languages) {
    languages["Japanese"] = "ja";
    languages["Portuguese"] = "pt";
    languages["English"] = "en";
    languages["Spanish"] = "es";
})(languages || (exports.languages = languages = {}));
var qualityEnum;
(function (qualityEnum) {
    qualityEnum["FULLHD"] = "1080p";
    qualityEnum["HD"] = "720p";
    qualityEnum["SD"] = "480p";
})(qualityEnum || (exports.qualityEnum = qualityEnum = {}));
var state;
(function (state) {
    state["ONGOING"] = "Lan\u00E7ando";
    state["HIATUS"] = "Hi\u00E1to";
    state["COMPLETED"] = "Completo";
    state["CANCELED"] = "Cancelado";
})(state || (exports.state = state = {}));
var userAnimeState;
(function (userAnimeState) {
    userAnimeState["watching"] = "Assistindo";
    userAnimeState["completed"] = "Completado";
    userAnimeState["on_hold"] = "Em espera";
    userAnimeState["dropped"] = "Desistido";
    userAnimeState["plan_to_watch"] = "Pretendo assistir";
})(userAnimeState || (exports.userAnimeState = userAnimeState = {}));
var userMangaState;
(function (userMangaState) {
    userMangaState["reading"] = "Lendo";
    userMangaState["completed"] = "Completado";
    userMangaState["on_hold"] = "Em espera";
    userMangaState["dropped"] = "Desistido";
    userMangaState["plan_to_read"] = "Pretendo ler";
})(userMangaState || (exports.userMangaState = userMangaState = {}));
var roles;
(function (roles) {
    roles["adm"] = "Administrador";
    roles["client"] = "Cliente";
    roles["creator"] = "Criador";
})(roles || (exports.roles = roles = {}));
var priorityValue;
(function (priorityValue) {
    priorityValue["LOW"] = "Baixa";
    priorityValue["MEDIUM"] = "Media";
    priorityValue["HIGH"] = "Alta";
})(priorityValue || (exports.priorityValue = priorityValue = {}));
exports.ratingLabel = {
    0.5: "PUTA QUE PARIU",
    1: "Horrivel",
    1.5: "Muito Ruim",
    2: "Ruim",
    2.5: "Na Média",
    3: "Ok",
    3.5: "Bom",
    4: "Muito Bom",
    4.5: "Incrivel",
    5: "Obra-prima"
};
