export interface Comment {
    id:number;
    parent_id:number;
    anime_id:string;
    user_id:string;
    user_name:string;
    content:string;
    created_at:Date;
    edited_at:Date;
    episode_id:string;
}
export interface Vote{
    id:number;
    comment_id:number;
    user_id:string;
    vote_type:number;
}
