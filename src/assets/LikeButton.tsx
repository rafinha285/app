import mongoose from "mongoose";
import React, {useState} from "react"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHeart} from "@fortawesome/free-solid-svg-icons";

// interface LikeProp{
//     aniId:mongoose.Types.ObjectId;
//     style:React.CSSProperties
// }
// const LikeButton:React.FC<LikeProp> = ({aniId,style}) =>{
const LikeButton = () =>{
    const [isLiked,setIsLiked] = useState(false);
    function handleLike(e:React.MouseEvent<HTMLButtonElement>){
        setIsLiked(prevIsLiked => !prevIsLiked)
        if(isLiked){
            // $.ajax("/api/like/",{
            //     headers:{

            //     }
            // })
        }else{

        }
        e.preventDefault()
    }

    return(
        <button
            className={`aniLik ${isLiked?'aniLikSel':''}`}
            onClick={handleLike}
        >
            <FontAwesomeIcon icon={faHeart} style={{fontSize:"1.2em"}}></FontAwesomeIcon>
        </button>
    )
}
export default LikeButton
