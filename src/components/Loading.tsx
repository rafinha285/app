import React from "react";
import "../css/loading.css"
import {faSpinner} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const Loading:React.FC =()=>{
    return(
        <div className="main-loading">
            <div>
                <h1>Loading anime</h1>
                <FontAwesomeIcon icon={faSpinner} spinPulse />
            </div>
        </div>
    )
}

export default Loading
