import React, {useContext} from 'react';
import "./css/comments.css"
import Comment from "./components/Comment";
import globalContext, {GlobalContextType} from "../../GlobalContext";

const Comments:React.FC = () => {
    const {isLogged,user} = useContext<GlobalContextType|undefined>(globalContext)!

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
                <Comment></Comment>
            </div>
        </div>
    )
}
export default Comments;