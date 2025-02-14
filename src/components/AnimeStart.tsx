import { Box, Rating } from "@mui/material";
import React from "react";
import { ratingLabel } from "../types/types";
import { GlobalContextType } from "../GlobalContext";
import { Anime, AnimeUser } from "../types/Anime.ts";
import { getLabelText, handleRatingValue } from "../functions/animeFunctions";
import StarIcon from '@mui/icons-material/Star';

interface props{
    ratingHover:number
    setRatingHover:React.Dispatch<React.SetStateAction<number>>
    setRatingValue:React.Dispatch<React.SetStateAction<number>>
    context:GlobalContextType
    // ani:Anime|AnimeUser;
    aniId:string
    ratingValue:number|null|undefined
}
const AnimeStar:React.FC<props> = ({ratingHover,setRatingHover,setRatingValue,context,ratingValue,aniId})=>{
    return(
        <div style={{padding:"auto",border:"1px white solid",borderRadius:'5px'}} className="not">
            <Rating
                className="rating"
                name="rating"
                defaultValue={0}
                value={ratingValue}
                precision={0.5}
                getLabelText={(v)=>getLabelText(v,ratingLabel)}
                onChange={(event,newValue)=>{
                    handleRatingValue(newValue!,context,aniId,setRatingValue)
                }}
                onChangeActive={(event, newHover) => {
                    setRatingHover(newHover);
                }}
                emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                size="large"
            />
            <div style={{marginLeft:2,color:"white"}}>
                <p>
                {ratingValue!== null&&(
                    <>
                        {ratingLabel[ratingHover! !== -1?ratingHover!:ratingValue!]}
                    </>
                )}</p>
            </div>
            {/* {ratingValue!== null&&(
                <Box sx={{ml:2,color:"white"}}>{ratingLabel[ratingHover! !== -1?ratingHover!:ratingValue!]}</Box>
            )} */}
        </div>
    )
}
export default AnimeStar
