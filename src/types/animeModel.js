"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.animeListStatus = void 0;
var animeListStatus;
(function (animeListStatus) {
    animeListStatus[animeListStatus["watching"] = 0] = "watching";
    animeListStatus[animeListStatus["completed"] = 1] = "completed";
    animeListStatus[animeListStatus["on_hold"] = 2] = "on_hold";
    animeListStatus[animeListStatus["dropped"] = 3] = "dropped";
    animeListStatus[animeListStatus["plan_to_watch"] = 4] = "plan_to_watch";
})(animeListStatus || (exports.animeListStatus = animeListStatus = {}));
