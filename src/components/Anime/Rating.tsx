import React from "react";
import { Anime } from "../../types/animeModel";
interface props{
    setRatingValue:React.Dispatch<React.SetStateAction<string|undefined>>,
    ratingValue:string|undefined,
    ani:Anime
}
const Rating:React.FC<props> = ({setRatingValue,ratingValue,ani})=>{
    const handleRatingChange = (e:React.ChangeEvent<HTMLSelectElement>)=>{
        if(e.target.value !== 'none'){
            setRatingValue(e.target.value)
        }
    }
    const handleRatingSubmit = async()=>{
        let isInAnimeList = await fetch(`/user/animelist/checklist/${ani.id}`).then(r=>r.json()).then((r:{success:boolean})=>r.success)
        if(isInAnimeList){
            //TODO fazer uma função para pegar ja com o fetch com os headers certos
            await fetch(`/user/animelist/rating/${ani.id}`,{
                method:"POST",
                headers: {'Content-Type': 'application/json'},
                body:JSON.stringify({
                    rating:parseInt(ratingValue!)
                })
            })
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
            <button onClick={()=>handleRatingSubmit()} className="aniSNota"><i className="fa-solid fa-star" style={{float:"none"}}></i> Submit</button>
        </div>
    )
}
export default Rating