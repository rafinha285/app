// import React, { useEffect ,useState} from "react";
// import Header from "../../components/Header";
// import Footer from "../../components/Footer";
// import Searchh from "../../components/Searchh";
// import { Anime} from "../../types/Anime";
// import "../../css/search.css"
// import { useParams , Link} from "react-router-dom";
// import { Helmet } from "react-helmet";
//
//
// const GenSearch:React.FC = ()=>{
//     var {gen} = useParams()
//     // const [gens,setGens] = useState<Anime[]>()
//
//     useEffect(()=>{
//         const fetchGens = () =>{
//             // fetch(`/ani/g/gen/${gen}`).then(async r=>{
//             //     if(r.ok){
//             //         setGens(await r.json())
//             //     }
//             // })
//         }
//         fetchGens()
//     },[])
//     return(
//         <html lang="pt-BR">
//             <Helmet>
//                 <title>{`Procurar gênero: ${gen}`}</title>
//             </Helmet>
//             <Header />
//             <div>
//                 {gens?.map((genn,index)=>(
//                     <Searchh ser={genn} key={index}></Searchh>
//                 ))}
//             </div>
//             <Footer />
//         </html>
//     )
// }
// export default GenSearch


import SearchBase, {SearchBaseProps, SearchBaseState, SearchParams} from "./SearchBase.tsx";
import {Anime} from "../../types/Anime.ts";
import React from "react";
import {withParams} from "../../functions/withParams.tsx";
import {getFromApi} from "../../functions/requestFunctions.ts";

interface Props extends SearchBaseProps{}

interface State extends SearchBaseState {
    animes: Anime[],
}


class GenSearch extends SearchBase<Props, State>{
    state = {
        animes: [],
        err: false,
        errReason: null,
    }

    async componentDidMount() {
        getFromApi(`/anime/genre/${this.props.params.search}`)
    }

    render(){
        return (
            <div>

            </div>
        )
    }
}
export default withParams<SearchParams>(GenSearch);