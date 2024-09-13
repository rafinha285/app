import React from "react";
import {DiscussionEmbed} from "disqus-react";

interface props{
    //indentifier é o id do anime ou do episódio
    indentifier:string
    type:"Episódio"|'Anime',
    name:string
}
const Comements:React.FC<props> = ({indentifier,type,name})=>{
    return (
        <div className="comments">
            <DiscussionEmbed
                shortname='animefoda-top'
                config={
                    {
                        url: window.location.href,
                        identifier: indentifier,
                        title: `Comentarios do ${type}: ${name}`,
                        language: 'pt_BR'
                    }
                }
            />
        </div>
    )
}
export default Comements;
