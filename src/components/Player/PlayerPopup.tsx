import React from "react";
import Popup from "reactjs-popup";
import {PopupActions} from "reactjs-popup/dist/types";
import {APITypes} from "plyr-react";
import {EpisodeUser} from "../../types/episodeModel";
import {getEpTime} from "../../features/main";

interface props{
    plyrRef: React.RefObject<APITypes>;
    epUser:EpisodeUser|null;
    open:boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const PlayerPopup:React.FC<props> = ({plyrRef,epUser,open,setOpen}) =>{
    const handleClick = (e:React.MouseEvent) =>{
        e.stopPropagation();
        if (plyrRef.current && plyrRef.current.plyr && epUser?.dropped_on !== undefined) {
            plyrRef.current.plyr.currentTime = epUser.dropped_on;
            setOpen(false);
        }
    }
    const handleClose = (e: React.MouseEvent) => {
        e.preventDefault();
        setOpen(false);
    };
    return (
        <div
            className="episode-popup"
            onClick={(e) => {
                e.preventDefault();
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
                    <i className="fa-solid fa-X" />
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
