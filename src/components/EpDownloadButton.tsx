import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDownload} from "@fortawesome/free-solid-svg-icons";

interface props{
    reso:string
    downloadHandle:(reso:string)=>void
}

const EpDownloadButton:React.FC<props> = ({reso,downloadHandle}) =>{
    return(
        <button className="download-button" name={reso.split("x")[1].toLocaleUpperCase()} onClick={()=>downloadHandle(reso)}>{reso.split("x")[1].toUpperCase()}P<FontAwesomeIcon icon={faDownload}/></button>
    )
}
export default EpDownloadButton
