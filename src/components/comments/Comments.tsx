import React from 'react';
import "./css/comments.css"

const Comments:React.FC = () => {
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

            </div>
        </div>
    )
}
export default Comments;