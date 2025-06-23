import React from "react";
import {fetchUser} from "../../../../functions/userFunctions";

export async function postComment(page_id:string,ref:React.RefObject<HTMLTextAreaElement>,parent_id?:string): Promise<void> {
    await fetchUser(`/comments/p/new/${page_id}`,"POST",{
        parent_id,
        content:ref.current?.value
    })
}
