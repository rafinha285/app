import React from "react";

interface props{
    reso:string
    downloadHandle:(reso:string)=>void
}

const EpDownloadButton:React.FC<props> = ({reso,downloadHandle}) =>{
    return(
        <button className="download-button" name={reso.split("x")[1].toLocaleUpperCase()} onClick={()=>downloadHandle(reso)}>{reso.split("x")[1].toUpperCase()}P<i className="fa-solid fa-download"/></button>
    )
}
export default EpDownloadButton