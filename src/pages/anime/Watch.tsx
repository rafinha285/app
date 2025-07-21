import {Link} from "react-router-dom";
import React from "react";
import {Anime} from "../../types/Anime.ts";
import {withParams} from "../../functions/withParams.tsx";
import GlobalContext from "../../GlobalContext.tsx";
import BasePage, {BaseState} from "../BasePage.tsx";
import {EpisodeDTO, EpisodeUser} from "../../types/Episode.ts";
import {Helmet} from "react-helmet";
import {SeasonDTO} from "../../types/Season.ts";
import Header from "../../components/Header.tsx";
import Footer from "../../components/Footer.tsx";

import "../../css/watch.css"
import LikeButton from "../../assets/LikeButton.tsx";
import {cdnUrl} from "../../const.ts";
import NewPlayer from "../../components/player/NewPlayer.tsx";
import Comments from "../../components/comments/Comments.tsx";

type Params = {
    animeId:string,
    seasonId: string,
    id: string,
}

type Props = {
    params: Params
}

type State = BaseState & {
    ani: Anime | null;
    episode: EpisodeDTO | null;
    season: SeasonDTO | null;
    episodeUser: EpisodeUser | null;
}

class Watch extends BasePage<Props, State> {

    static contextType = GlobalContext;
    context!: React.ContextType<typeof GlobalContext>;

    match = this.props.params;

    state: State = {
        ani: null,
        episode: null,
        season: null,
        episodeUser: null,
        err: false,
        errReason: "",
    }

    async componentDidMount() {
        const ani = await super.getAnime(this.match.animeId)
        if(!ani) return super.idNotFound("Anime")
        const season = ani.seasons.find(v=>v.id === this.match.seasonId)
        if(!season) return super.idNotFound("Season")
        const episode = season.episodes.find(v=>v.id === this.match.id)
        if(!episode) return super.idNotFound("Episódio")
        this.setState({
            ani:ani,
            episode,
            season
        })
    }


    render(){
        const {ani, episode, season, err, errReason} = this.state;
        // if(err) return <h1>Erro ao carregar a pagina: {errReason}</h1>
        if(!ani || !season || !episode) return <h1>Carregando</h1>
        return (
            <>
                <Helmet>
                    <title>{`Assistir: ${ani?.name}, ${episode?.name}`}</title>
                </Helmet>
                <Header/>

                <Link className={"link-anime"} to={`/Anime/${ani?.id}`}>
                    <div className={'card'}>
                        <div className={'card-hover'}>
                            <div>
                                <span>{ani.name}</span><br/>
                                <span className={'epSpan'}>{episode.name}</span>
                            </div>
                            <div className={"card-content-l"}>
                                <LikeButton/>
                            </div>
                        </div>
                        <div className="card-img">
                            <img src={`${cdnUrl}/ani/img/${ani.id}/${ani.id}.jpg`} alt={ani.name} />
                        </div>
                    </div>
                </Link>


                <NewPlayer anime={ani} season={season} episode={episode} />

                <Comments page_id={episode.id} classes={["player"]}/>
                <Footer/>
            </>
        )
    }
}

export default withParams<Params,{}>(Watch);