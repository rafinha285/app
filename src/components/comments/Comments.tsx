import React, {useContext, useEffect, useState} from 'react';
import "./css/comments.css"
import CommentComponent from "./components/CommentComponent";
import globalContext, {GlobalContextType} from "../../GlobalContext";

interface CommentProps {
    page_id:string;
}

const Comments:React.FC<CommentProps> = ({page_id}) => {
    const {isLogged,user} = useContext<GlobalContextType|undefined>(globalContext)!

    const [comments,setComments] = useState<Comment[]>([])

    async function fetchComments(){
        const res = await fetch("/comments/g/")
    }
    useEffect(()=>{
        console.log("a")
    },[])

    return (
        <div className="comments">
            <div className='comments-input'>
                <div className='comments-avatar'>
                    {}
                </div>
                <div className='comments-textarea-wrapper'>
                    <textarea cols={2} placeholder='Escreva seu comentário' />
                </div>
            </div>
            <div className="comments-main">
                {comments.map((comment:Comment) => (
                    <CommentComponent></CommentComponent>
                ))}
                {/*<CommentComponent></CommentComponent>*/}
            </div>
        </div>
    )
}
export default Comments;
