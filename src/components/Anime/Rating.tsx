import React from "react";
import { Anime } from "../../types/animeModel";
import { fetchUser } from "../../features/main";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faStar} from "@fortawesome/free-solid-svg-icons";
interface props{
    setRatingValue:React.Dispatch<React.SetStateAction<string|undefined>>,
    ratingValue:string|undefined,
    aniId:string
}
const Rating:React.FC<props> = ({setRatingValue,ratingValue,aniId})=>{
    const handleRatingChange = (e:React.ChangeEvent<HTMLSelectElement>)=>{
        if(e.target.value !== 'none'){
            setRatingValue(e.target.value)
        }
    }
    const handleRatingSubmit = async()=>{
        let isInAnimeList = await fetchUser(`/user/animelist/checklist/${aniId}`,'GET').then(r=>r.json()).then((r:{success:boolean})=>r.success)
        if(isInAnimeList){
            fetchUser(`/user/animelist/rating/${aniId}`,"POST",{rating:parseInt(ratingValue!)})
        }
    }
    return(
        <div style={{display:'flex',flexDirection: 'column', flexWrap: 'wrap'}} className="not">
            <select className="selectN" onChange={handleRatingChange} value={ratingValue}>
                <option value="none">Selecione sua nota</option>
                <option value="10">(10) Obra-prima</option>
                <option value="9">(9) Incrivel</option>
                <option value="8">(8) Muito Bom</option>
                <option value="7">(7) Bom</option>
                <option value="6">(6) Ok</option>
                <option value="5">(5) Na Média</option>
                <option value="4">(4) Ruim</option>
                <option value="3">(3) Muito Ruim</option>
                <option value="2">(2) Horrivel</option>
                <option value="1">(1) Inassistível</option>
            </select>
            <button onClick={()=>handleRatingSubmit()} className="aniSNota"><FontAwesomeIcon icon={faStar} style={{float:"none"}}></FontAwesomeIcon> Submit</button>
        </div>
    )
}
export default Rating
