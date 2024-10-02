import React from "react";
import {Anime} from "../../../../types/animeModel.ts";
import {trim} from "../../../../features/main.ts";

interface Props {
    user_id: string;
    anime:Anime;
}

const IndexAdminAnime:React.FC<Props> = ({user_id,anime}) =>{
    return(
        <div onClick={(e) => {
            e.preventDefault()
            window.location.href = `/admin/${user_id}/edit/${anime.id}`
        }}>
            <div>
                <p>{anime.name}</p>
                <p>{trim(anime.description,200)}</p>
            </div>
        </div>
    )
}
export default IndexAdminAnime;
