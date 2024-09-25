        import React from "react";
import {EpisodeUser} from "../../../types/episodeModel";
import {getEpTime} from "../../../features/main";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faX} from "@fortawesome/free-solid-svg-icons";

interface props{
    epUser?:EpisodeUser;
    open:boolean;
    setOpen:()=> void;
    handleSkip:(skip:number)=>void;
}
const PlayerPopup:React.FC<props> = ({epUser,open,setOpen,handleSkip}) =>{
    const handleClick = (e:React.MouseEvent) =>{
        e.stopPropagation();
        handleSkip(epUser?.dropped_on!)
    }
    const handleClose = (e: React.MouseEvent) => {
        e.stopPropagation();
        setOpen();
    };
    console.log(epUser)
    return (
        <div
            className="episode-popup"
            onClick={(e) => {
                e.stopPropagation();
                handleClose(e);
            }}
            style={{ display: open ? 'flex' : 'none' }}
        >
            <div
                className="episode-popup__container"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="close"
                    onClick={(e) => {
                        e.preventDefault();
                        handleClose(e);
                    }}
                >
                    <FontAwesomeIcon icon={faX}/>
                </button>
                <div>
                    <p>Você parou em {getEpTime(epUser?.dropped_on!)}</p>
                    <p>Deseja continuar?</p>
                    <div>
                        <button className="button" onClick={handleClick}>Sim</button>
                        <button className="button" onClick={handleClose}>Não</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PlayerPopup