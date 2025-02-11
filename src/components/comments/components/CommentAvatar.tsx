import React from "react";
import {User} from "../../../types/User";

interface Props{
    isLoggedIn: boolean;
    user_id: string
}

const CommentAvatar:React.FC<Props> = ({isLoggedIn,user_id}) =>{
    return(
        isLoggedIn?(
            <div className='comments-avatar'>
                {}
            </div>
        ):<></>
    )
}
export default CommentAvatar
