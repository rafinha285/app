import React, {useContext, useEffect, useRef, useState} from 'react';
import "./css/comments.css"
import CommentComponent from "./components/CommentComponent";
import globalContext, {GlobalContextType} from "../../GlobalContext";
import {postComment} from "./functions/post/postComment";
import CommentAvatar from "./components/CommentAvatar";
import {Comment} from "../../types/Comment";
import {apiUrl} from "../../const";
import RequestType from "../../types/ResponseType"

interface CommentProps {
    page_id:string;
    classes?:string[];
}

const Comments:React.FC<CommentProps> = ({page_id,classes}) => {
    const {isLogged,user} = useContext<GlobalContextType|undefined>(globalContext)!

    const inputRef = useRef<HTMLTextAreaElement>(null);

    const sendComment = async()=>{
        if(inputRef.current && inputRef.current.value !== ""){
            await postComment(page_id,inputRef)
            await fetchComments()
        }
    }

    const keyDownEvent = (e:React.KeyboardEvent<HTMLTextAreaElement>) =>{
        if(e.key === "Enter"){
            e.preventDefault()
            sendComment()
        }
    }

    const [comments,setComments] = useState<Comment[]>([])

    async function fetchComments(){
        const res:RequestType<Comment[]> = await (await fetch(`${apiUrl}/g/comments/page/${page_id}`)).json();
        setComments(res.data)
        console.log(res.data)
    }
    useEffect(()=>{
        console.log("a")
        fetchComments()
    },[])

    return (
        <div className={`comments ${classes?.map(v=>`${v} `)}`}>
            <div className='comments-input'>
                <CommentAvatar isLoggedIn={isLogged} user_id={user?._id!}/>
                <div className='comments-textarea-wrapper'>
                    <textarea
                        cols={2}
                        placeholder='Escreva seu comentário'
                        ref={inputRef}
                        onKeyDown={keyDownEvent}
                    />
                </div>
                <button className='button'>
                    Comentar
                </button>
            </div>
            <div className="comments-main">
                {comments.map((comment:Comment) => (
                    <CommentComponent
                        comment={comment}
                    />
                ))}
                {/*<CommentComponent></CommentComponent>*/}
            </div>
        </div>
    )
}
export default Comments;
