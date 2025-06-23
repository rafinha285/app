import React, {useState} from "react"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHeart} from "@fortawesome/free-solid-svg-icons";

const LikeButton = () =>{
    const [isLiked,setIsLiked] = useState(false);
    function handleLike(e:React.MouseEvent<HTMLButtonElement>){
        setIsLiked(prevIsLiked => !prevIsLiked)
        if(isLiked){

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
