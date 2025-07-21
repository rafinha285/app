import React from "react"
import "../../css/index.css"
import "../../css/base.css"
import "../../css/animepage/anime.css"
import "../../css/animepage/anime_.css"
import "../../css/loading.css"
import {Anime} from "../../types/Anime";
import {withParams} from "../../functions/withParams.tsx";
import {Helmet} from "react-helmet";
import {getEpTime} from "../../functions/stringFunctions.ts";
import Header from "../../components/Header.tsx";
import Footer from "../../components/Footer.tsx";
import LikeButton from "../../assets/LikeButton.tsx";
import AniGeneros from "../../assets/Animegenre.tsx";
import AniProducers, {prodType} from "../../assets/AnimeProd.tsx";
import {getMonthName} from "../../functions/dateFunctions.ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faStar} from "@fortawesome/free-solid-svg-icons";
import {state, State as StateType} from "../../types/types.ts";
import {cdnUrl} from "../../const.ts";
import EpisodeLink from "../../assets/EpisodeLink.tsx";
import GlobalContext from "../../GlobalContext";
import BasePage, {BaseState} from "../BasePage.tsx";

type Params = {
    id: string
}

type Props = {
    params: Params;
};

type State = BaseState & {
    ani: Anime | null;
    selectedSeasonId: string;
};


class AnimePage extends BasePage<Props, State>{
    static contextType = GlobalContext;
    context!: React.ContextType<typeof GlobalContext>;
    match = this.props;
    state: State = {
        ani: null,
        err: false,
        errReason: "",
        selectedSeasonId:""
    }

    async componentDidMount() {
        const {id} = this.match.params;
        if(!id) this.idNotFound("Anime")
        const ani = await super.getAnime(this.match.params.id);
        if (!ani) this.setState({
            err: true,
            errReason:"Anime não encontrado"
        });
        this.setState({
            ani: ani ? ani : null
        })
        if(this.state.ani){
            const {ani} = this.state;
            this.setState({selectedSeasonId:ani.seasons.length > 0? ani.seasons[0].id:""});
            console.log(this.state, ani?.seasons)
        }
    }

    componentDidUpdate(prevProps: Props, prevState: State) {
        // Se carregou o `ani` e antes estava vazio, defina a temporada padrão
        if (this.state.ani && !prevState.ani) {
            const firstSeason = this.state.ani.seasons[0];
            if (firstSeason) {
                this.setState({ selectedSeasonId: firstSeason.id });
            }
        }
    }

    // private fetchAnime = async() => {
    //     // console.log(this.match)
    //     const {id} = this.match.params;
    //
    // }

    private stateTypeToStateEnum(input: StateType): state{
        const key = input.name as keyof typeof state; // ex: "COMPLETED"
        const enumValue = state[key];
        if (!enumValue) {
            throw new Error(`Estado inválido recebido: ${input.name}`);
        }
        return enumValue;
    }

    render() {
        const { ani, err, selectedSeasonId } = this.state;
        const releaseDate = ani && new Date(ani.releaseDate);
        if (err) return <h1>Erro ao carregar a pagina: {this.state.errReason}</h1>;
        if (!ani || !releaseDate) return <p>Carregando...</p>;
        return(
            <>
                <Helmet>
                    <title>{`${ani.name}`}</title>
                </Helmet>
                <Header></Header>
                <div className="anime-page">
                    <p className={"duration_top"}>Anime - Duração média: <span>{ani.averageEpTime?getEpTime(ani.averageEpTime):0}</span></p>
                    <div className={"content-left"}>
                        <h2 className={"anime-title"}>{ani.name}</h2>
                        <div style={{display:"inline"}}>
                            <p className={"duration_top details"}>Ano: {releaseDate.getFullYear()}</p>
                            <p className={"duration_top details"}>Qualidade: {ani.quality}</p>
                        </div>
                        <LikeButton/>
                        <p className={"duration_top"}>{ani.description}</p>
                        <div className={"inline-details-div"}>
                            <p className={"inline-details"}>Gêneros:</p>
                            <div className={"inline-details"}>
                                {ani.genre.map((v,i)=>(
                                    <AniGeneros genre={v} index={i}/>
                                ))}
                            </div>
                        </div>
                        <div className={"inline-details-div"}>
                            <p className={"inline-details"}>Produtores: </p>
                            <div className={"inline-details"}>
                                {ani.producers.map((v,i)=>(
                                    <AniProducers prod={v} index={i} typee={prodType.prod}/>
                                ))}
                            </div>
                        </div>
                        <div className={"inline-details-div"}>
                            <p className={"inline-details"}>{ani.creators.length>1?"Criador: ":"Criadores: "}</p>
                            <div className={"inline-details"}>
                                {ani.creators.map((v,i)=>(
                                    <AniProducers prod={v} index={i} typee={prodType.crea}/>
                                ))}
                            </div>
                        </div>
                        <div className={"inline-details-div"}>
                            <p className={"inline-details"}>{ani.creators.length>1?"Estudio: ":"Estudios: "}</p>
                            <div className={"inline-details"}>
                                {ani.studios.map((v,i)=>(
                                    <AniProducers prod={v} index={i} typee={prodType.stud}/>
                                ))}
                            </div>
                        </div>
                        <div>
                            {ani.name2?(<p>Nome alternativo: {ani.name2}</p>):(<></>)}
                            <p>Idioma: {ani.language}</p>
                            <p>Data de lançamento:
                                <b>{releaseDate.getDate().toString()}</b> de
                                <b> {getMonthName(releaseDate, false)}</b> de
                                <b> {releaseDate.getFullYear()}</b>
                            </p>
                            <p>Estado: <b>{this.stateTypeToStateEnum(ani.state)}</b></p>
                            <p>Nota: <b>{ani.rating}</b> <FontAwesomeIcon icon={faStar}/></p>

                        </div>
                    </div>

                    <div className={"content-right"}>
                        <div className={"img"}>
                            <img src={`${cdnUrl}/ani/img/${ani.id}/${ani.id}.jpg`} alt={`${ani.name}`}/>
                        </div>
                    </div>
                    <div className="seasons">
                        <select
                            value={selectedSeasonId}
                            onChange={(e) => {
                                console.log(e.target.value);
                                this.setState({selectedSeasonId: e.target.value})
                            }}
                        >
                            {ani.seasons.sort((a,b)=>a.index-b.index).map(s=>(
                                <option value={s.id} key={s.index}>{s.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="eps">
                        {ani.seasons.map((season, i, arr)=>(
                            <div style={{ display: season.id === selectedSeasonId ? "block" : "none" }}
                                 key={season.index}>
                                {season.episodes.sort((a,b)=>a.epIndex-b.epIndex).map((v,i)=>(
                                    <EpisodeLink key={v.epIndex} ani={ani} s={season} ep={v} handleWatched={()=>{}} isLogged={!!this.context?.isLogged}/>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
                <Footer/>
            </>
        )
    }

}
export default withParams<Params,{}>(AnimePage);