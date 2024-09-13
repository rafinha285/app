import React, {RefObject} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faAnglesRight,
    faBackward, faChevronRight, faClosedCaptioning as faClosedCaptioningSolid, faDownLeftAndUpRightToCenter,
    faForward, faGear,
    faPause,
    faPlay,
    faUpRightAndDownLeftFromCenter,
    faVolumeHigh,
    faVolumeLow,
    faVolumeOff, faVolumeXmark
} from "@fortawesome/free-solid-svg-icons";
import {Episode} from "../../../types/episodeModel";
import {getEpTime} from "../../../features/main";
import {faClosedCaptioning} from "@fortawesome/free-regular-svg-icons";
import VideoPlayerSettings from "./Config";
import {quality} from "../../../types/types";


interface props{
    isPlaying: boolean;
    togglePlayPause: (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement, MouseEvent>)=> void;
    ep:Episode;
    eps:Map<number,Episode>;
    currentTime:number;
    currentBuffer:number;
    handleSeek:(e: React.ChangeEvent<HTMLInputElement>)=> void;
    handleToggleMute:(e: React.MouseEvent<HTMLButtonElement>)=> void;
    muted:boolean;
    volume:number;
    handleVolumeChange:(e: React.ChangeEvent<HTMLInputElement>)=> void;
    handleBackward:(e:React.MouseEvent<HTMLButtonElement>)=>void;
    handleForward:(e:React.MouseEvent<HTMLButtonElement>)=>void;
    toggleFullscreen:(e: React.MouseEvent<HTMLButtonElement>)=>void;
    isFullscreen:boolean;
    toggleCaptions:(e: React.MouseEvent<HTMLButtonElement>)=>void;
    captionsActive:boolean;
    isConfigOpen:boolean;
    toggleConfig:(e:React.MouseEvent<HTMLButtonElement>)=>void;
    selectedCaptions:string,
    setSelectedCaptions:React.Dispatch<React.SetStateAction<string>>;
    currentQuality: quality;
    handleQualityChange:(v:quality) => void;
    currentSpeed:number;
    handleSpeedChange:(v:number) => void;
    handleSkipIntro:(e: React.MouseEvent<HTMLButtonElement>)=> void;
}
const Controls:React.FC<props> = (
    {
        isPlaying,
        togglePlayPause,
        ep,
        eps,
        currentTime,
        currentBuffer,
        handleSeek,
        handleToggleMute,
        muted,
        volume,
        handleVolumeChange,
        handleBackward,
        handleForward,
        toggleFullscreen,
        isFullscreen,
        toggleCaptions,
        captionsActive,
        isConfigOpen,
        toggleConfig,
        selectedCaptions,
        setSelectedCaptions,
        currentQuality,
        handleQualityChange,
        currentSpeed,
        handleSpeedChange,
        handleSkipIntro
    }) =>{

    const handleNextEp = async(e:React.MouseEvent)=>{
        e.stopPropagation();
        let newEp = eps.get(ep.epindex+1)
        window.location.href = `/Anime/${newEp?.anime_id}/watch/${newEp?.season_id}/${newEp?.id}`
    }
    return (
        <div className='controls' onClick={togglePlayPause}>


            <button className='content' onClick={handleBackward}>
                <FontAwesomeIcon icon={faBackward}/>
                <span className='tooltip'>
                        Retroceder 10s
                    </span>
            </button>


            <button className='content' onClick={togglePlayPause}>
                <FontAwesomeIcon icon={!isPlaying ? faPlay : faPause}/>
                <span className='tooltip'>
                        Play/Pause
                    </span>
            </button>


            <button className='content' onClick={handleForward}>
                <FontAwesomeIcon icon={faForward}/>
                <span className='tooltip'>
                        Pular 10s
                    </span>
            </button>


            <div className='progress content'>
                {/* Barra de buffer */}
                <div className="buffered-bar">
                    <div style={{width: `${(currentBuffer / ep.duration)*100}%`}}></div>
                </div>

                {/* Barra de progresso assistido */}
                <div className="watched-bar">
                    <div style={{width: `${(currentTime / ep.duration)*100}%`}}></div>
                </div>

                <input
                    className='progress-input'
                    type='range'
                    max={ep.duration}
                    min={0}
                    step={0.01}
                    value={currentTime}
                    aria-valuemax={ep.duration}
                    aria-valuenow={currentTime}
                    onChange={handleSeek}
                    onClick={(e) => e.stopPropagation()}
                />
                {/*<progress*/}
                {/*    className="progress-bar"*/}
                {/*    max={ep.duration!}*/}
                {/*    value={currentTime} // Atualizado conforme o tempo assistido*/}
                {/*/>*/}
                <span className='tooltip'></span>
            </div>


            <span className='content time'>{`${getEpTime(currentTime)} / ${getEpTime(ep.duration)}`}</span>


            <div className='volume content'>
                <button onClick={handleToggleMute}>
                    <FontAwesomeIcon icon={
                        !muted
                            ? volume === 0
                                ? faVolumeOff
                                : volume >= 0.5
                                    ? faVolumeHigh
                                    : faVolumeLow
                            : faVolumeXmark
                    }/>
                    <span className='tooltip'>Mutar</span>
                </button>
                <input
                    className='content'
                    id='volume-input'
                    type='range'
                    max={1}
                    step={0.01}
                    onChange={handleVolumeChange}
                    onClick={(e) => e.stopPropagation()}
                    value={volume}
                />
            </div>


            <button className={`skip-intro ${currentTime>=ep.openingstart&&currentTime <= ep.openingend ? 'skip-active':''} content`} onClick={handleSkipIntro}>
                Pular Intro
                <FontAwesomeIcon icon={faAnglesRight}/>
            </button>

            <button className={`skip-intro ${currentTime >= ep.ending && eps.has(ep.epindex+1)? 'skip-active':''} content`} onClick={handleNextEp}>
                Próximo episódio
                <FontAwesomeIcon icon={faChevronRight}/>
            </button>


            <button className='content' onClick={toggleCaptions}>
                {/*//fazer com q quando a legenda selecionada seja -1 ele mostre em gray e desative o botao */}
                <FontAwesomeIcon icon={captionsActive?faClosedCaptioningSolid:faClosedCaptioning} />
                <span className='tooltip'>Ligar/Desligar Legendas</span>
            </button>




            <div className='config'>
                <button className='content config' onClick={toggleConfig}>
                    <FontAwesomeIcon icon={faGear} />
                </button>
                {isConfigOpen&&(
                    <VideoPlayerSettings
                        setSelectedCaptions={setSelectedCaptions}
                        selectedCaptions={selectedCaptions}
                        currentQuality={currentQuality}
                        handleQualityChange={handleQualityChange}
                        currentSpeed={currentSpeed}
                        handleSpeedChange={handleSpeedChange}
                        ep={ep}
                    />
                    // <div className='config-popup'>
                    //     <button className='config-popup-inner'>
                    //         <span></span>
                    //     </button>
                    //     <button className='config-popup-inner'>
                    //
                    //     </button>
                    //     <div>
                    //
                    //     </div>
                    // </div>
                )}
            </div>


            <button className='content' onClick={toggleFullscreen}>
                <FontAwesomeIcon icon={!isFullscreen? faUpRightAndDownLeftFromCenter:faDownLeftAndUpRightToCenter} />
                <span className='tooltip'>Tela cheia</span>
            </button>
        </div>
    )
}
export default Controls;
