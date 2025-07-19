import {Episode} from "../../../types/Episode";

import {fetchUser} from "../../../functions/requestFunctions.ts";

export const handlePostSec = async (isLogged:boolean,sec: number,ep:Episode) => {
    if (isLogged) {
        let body = {
            episode_id: ep?.id,
            anime_id: ep?.animeId,
            dropped_on: sec,
            season_id: ep?.seasonId,
        }
        await fetchUser('/ep/user/p/', 'POST', body)
    }
}
