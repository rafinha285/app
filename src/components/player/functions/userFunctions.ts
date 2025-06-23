import {Episode} from "../../../types/Episode";
import {fetchUser} from "../../../functions/userFunctions";

export const handlePostSec = async (isLogged:boolean,sec: number,ep:Episode) => {
    if (isLogged) {
        let body = {
            episode_id: ep?.id,
            anime_id: ep?.anime_id,
            dropped_on: sec,
            season_id: ep?.season_id,
        }
        await fetchUser('/ep/user/p/', 'POST', body)
    }
}
