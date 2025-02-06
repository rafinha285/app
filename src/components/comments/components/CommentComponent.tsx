import React, { FC } from 'react';
import CommentAvatar from "./CommentAvatar";
import {Comment} from "../../../types/Comment";
import "../css/comment.css"
import {fetchUser, getMonthName} from "../../../features/main";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHeart as faHeartSolid} from "@fortawesome/free-solid-svg-icons";
import {faFlag, faHeart as faHeartRegular} from "@fortawesome/free-regular-svg-icons";

interface CommentProps {
    comment: Comment;
}

const CommentComponent: FC<CommentProps> =({comment}) =>{
    const date = new Date(comment.created_at)
    const likeHandle = async() =>{
        await fetchUser("")
    }
    return(
        <div className="comment">
            {/*
                placeholder para depois colocar o id do usuario do comentário para pegar seu avatar
                tenho que fazer o usuario depois colocar o avatar q ele quiser
            */}
            <div className='comment-avatar-wrapper'>
                <CommentAvatar isLoggedIn={true} user_id={comment.user_id}/>
            </div>
            <div className="comment-main-wrapper">
                <div className='comment-content-wrapper'>
                    <div className='comment-username-wrapper'>
                        <p className='comment-username'><b>{comment.user_name}</b></p>
                        <p className='comment-date'>Postado: {date.getDayOfWeekName()}, {date.getDate()}/{date.getMonth()}/{date.getFullYear()}</p>
                    </div>
                    {/*Comentario*/}
                    <p className='comment-content'>
                        {comment.content}
                    </p>
                </div>
                <div className='comment-content-wrapper left-controls'>
                    <button className='comment-button'>
                        <FontAwesomeIcon icon={faFlag}/>
                    </button>
                    <button className='comment-button heart'>
                        <FontAwesomeIcon icon={faHeartRegular}/>
                    </button>
                </div>
            </div>
        </div>
    )
}
export default CommentComponent
