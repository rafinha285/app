import {fetchUser} from "../../../../features/main";
import React from "react";

export async function postComment(page_id:string,ref:React.RefObject<HTMLTextAreaElement>,parent_id?:string): Promise<void> {
    await fetchUser(`/comments/p/new/${page_id}`,"POST",{
        parent_id,
        content:ref.current?.value
    })
}
