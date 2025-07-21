import React from "react";

import {postToApiWithToken} from "../../../../functions/requestFunctions.ts";
import {Comment} from "../../../../types/Comment.ts";

export async function postComment(page_id:string,ref:React.RefObject<HTMLTextAreaElement>,parent_id?:string): Promise<void> {
    await postToApiWithToken<{},Comment>("/comment/post",{
        parentId:parent_id,
        pageId:page_id,
        content:ref.current?.value
    })
}
