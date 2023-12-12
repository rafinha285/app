import React from "react";
import "../css/episodes.css"
import { epLog } from "../types/logType";
import { getEpTime } from "../features/main";
import { Link } from "react-router-dom";

interface props{
    ep:epLog
}
const Episode:React.FC<props> = ({ep}) =>{

    
    // const img = document.querySelector(`img[alt="${ep.animename}"`) as HTMLImageElement
    // const canvas = document.createElement("canvas")
    // const context = canvas.getContext("2d")!


    // img?.addEventListener("load",function(){
    //     canvas.width = img.width
    //     canvas.height = img.height
    //     context!.drawImage(img, 0, 0, img.width, img.height);
    //     const imageData = context.getImageData(0, 0, img.width, img.height).data;
    //     const luminosidadeMedia = calcularMediaLuminosidade(imageData);
    //     const epAnimetitle = document.querySelector(`.ep-animetitle[datatype="${ep.ep}"]`)!; 
    //     const epTitle = document.querySelector(`.ep-title[datatype="${ep.ep}"]`)!;
    //     const time = document.querySelector(`span[datatype="${ep.ep}"]`)!;
    //     const timeIcon = document.querySelector(`i[datatype="${ep.ep}"]`)!

    //     if (luminosidadeMedia > 128) {
    //         // img.style.filter = 'brightness(0%)'; // Black
    //         console.log("black")
    //         $(epTitle).css("color", "black");
    //         $(epAnimetitle).css("color", "black");
    //         $(time).css("color", "black");
    //         $(timeIcon).css("color", "black");
    //       } else {
    //         // img.style.filter = 'brightness(100%)'; // White
    //         console.log("white")
    //         $(epTitle).css("color", "white");
    //         $(epAnimetitle).css("color", "white");
    //         $(time).css("color", "white");
    //         $(timeIcon).css("color", "white");
    //       }
    // })

    // function calcularMediaLuminosidade(imageData:Uint8ClampedArray) {
    //     let totalLuminosidade = 0;
      
    //     // Percorre os valores de luminosidade na imagem
    //     for (let i = 0; i < imageData.length; i += 4) {
    //       // Calcula a média ponderada dos componentes RGB (luminosidade)
    //       totalLuminosidade += 0.299 * imageData[i] + 0.587 * imageData[i + 1] + 0.114 * imageData[i + 2];
    //     }
      
    //     // Calcula a média de luminosidade
    //     const mediaLuminosidade = totalLuminosidade / (imageData.length / 4);
    //     return mediaLuminosidade;
    //   }
    console.log(ep,`/api/ep/${ep.anime}/${ep.season}/${ep.ep}/${ep.ep}.jpg`)
    return(
        <Link className="episodes-link" to={`/Anime/${ep.anime}/watch/${ep.season}/${ep.ep}`}>
            <div className="">
                <div className="ep-hover"/>
                <div className="ep-img">
                    <img alt={ep.animename} src={`/api/ep/${ep.anime}/${ep.season}/${ep.ep}/${ep.ep}.jpg`}></img>
                </div>
                <div className="ep-body">
                    <div className="ep-res">
                        <div className="ep-res-in">{ep.resolution.toUpperCase()}</div>
                    </div>
                    <div className="ep-time">
                        <span datatype={ep.ep}>{getEpTime(ep.duration)}</span>
                        <i datatype={ep.ep} className="far fa-clock"></i>
                    </div>
                    <div className="ep-animetitle" datatype={ep.ep}>
                    {ep.animename}
                    </div>
                    <div className="ep-title" datatype={ep.ep}>
                    {ep.name}
                    </div>
                </div>
            </div>
        </Link>
    )
}
export default Episode