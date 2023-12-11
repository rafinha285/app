import React from "react";
import "../css/loading.css"

const Loading:React.FC =()=>{
    return(
        <div className="main-loading">
            <div>
                <h1>Loading anime</h1>
                <i className="fa-solid fa-spinner fa-spin-pulse"></i>
            </div>
        </div>
    )
}

export default Loading