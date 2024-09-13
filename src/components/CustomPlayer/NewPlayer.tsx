import React, {useEffect, useState} from "react";
import {Episode, EpisodeUser} from "../../types/episodeModel";
import {cdnUrl} from "../../const";
import {quality} from "../../types/types";
import './css/player.css'
import {faPause, faPlay, faRepeat} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Controls from "./components/Controls";
import Captions from "./components/Captions";
import screenful from "screenfull";
import usePictureInPicture, {VideoRefType} from 'react-use-pip'
import {getQuality} from "./functions/configFunctions";
import {Cue, VTTData} from "webvtt-parser";

interface props{
    aniId:string;
    seasonId:string;
    ep:Episode;
    epUser?:EpisodeUser;
    eps:Map<number, Episode>;
}
const NewPlayer:React.FC<props> = ({aniId,seasonId,ep,epUser,eps}) => {
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
    const [volume, setVolume] = useState<number>(1); // Volume range 0 to 1
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [currentBuffer, setCurrentBuffer] = useState<number>(0);
    const [currentQuality,setCurrentQuality] = useState<quality>(getQuality());
    const [currentSpeed,setCurrentSpeed] = useState(1)
    const [muted,setMuted] = useState<boolean>(false);
    const [captionsActive, setCaptionsActive] = useState<boolean>(true);
    const [selectedCaptions,setSelectedCaptions] = useState<string>('por')
    const [isConfigOpen,setIsConfigOpen] = useState<boolean>(false);
    const [isControlsVisible,setIsControlsVisible] = useState<boolean>(false);
    const {
        isPictureInPictureActive,
        isPictureInPictureAvailable,
        togglePictureInPicture,
    } = usePictureInPicture(videoRef as VideoRefType)

    const [displayPlayButton,setDisplayPlayButton] = useState<boolean>(true);

    const playerContainerRef = React.useRef<HTMLDivElement>(null);

    //captions functions
    const [currentCue,setCurrentCue] = React.useState<Cue[]>([]);
    const [cueData,setCueData] = React.useState<VTTData>();


    const handleMouseMove = () => {
        setIsControlsVisible(true)
        // console.log(isControlsVisible);
        // Remover a classe após 3 segundos se o mouse não se mover mais
        setTimeout(() => {
            setIsControlsVisible(false)
            // console.log(isControlsVisible);
        }, 3000);
    };


    //quality functions
    const qualitySources: { [key in quality]: string } = ep.resolution.reduce((acc, resolution) => {
        // Verifica se a resolução é uma das qualidades permitidas
        acc[resolution.split('x')[1] as quality] = `${cdnUrl}/stream/${aniId}/${seasonId}/${ep.id}/${resolution.split('x')[1]}`;
        // console.log(acc)
        return acc;
    }, {} as { [key in quality]: string });

    useEffect(() => {
        if (videoRef.current && playerContainerRef.current) {
            const videoElement = videoRef.current;
            const q = currentQuality.replace('p','') as quality;
            const newSource = qualitySources[q]; // Definir a fonte de acordo com a qualidade atual
            const currentTimee = currentTime; // Armazenar o tempo atual do vídeo
            const isPlaying = !videoElement.paused; // Verifica se o vídeo está tocando

            // Atualiza a src diretamente
            videoElement.src = newSource;

            // Quando a nova fonte carregar, restaurar o tempo atual e o estado de reprodução
            videoElement.onloadedmetadata = () => {
                videoElement.currentTime = currentTimee; // Restaurar o tempo
                if (isPlaying) {
                    videoElement.play(); // Se estava tocando, continuar
                }
            };

            playerContainerRef.current.addEventListener('mousemove',handleMouseMove);

        }
        if(muted){
            setVolume(0);
        }
        window.addEventListener('keydown',handleKeyDown)
        return()=>{
            playerContainerRef.current?.removeEventListener('mousemove',handleMouseMove);
            window.removeEventListener('keydown',handleKeyDown)
        }
    }, [currentQuality,ep]);

    //handles

    const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
        const video = e.currentTarget;
        if (video.buffered.length) {
            const bufferedEnd = video.buffered.end(video.buffered.length - 1);
            setCurrentBuffer(bufferedEnd);
        }
        setCurrentTime(video.currentTime);
        if(captionsActive){
            const activeCues = cueData?.cues.filter(
                cue => cue.startTime <= video.currentTime && cue.endTime >= video.currentTime
            ) || [];
            // console.log(activeCues)
            setCurrentCue(activeCues)

        }else{
            setCurrentCue([])
        }
        // setCurrentCue([])
    };
    const togglePlayPause = (e?: React.MouseEvent<(HTMLDivElement|HTMLButtonElement), MouseEvent>) => {
        e?.stopPropagation()
        if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.play();
                setIsPlaying(true);
            } else {
                videoRef.current.pause();
                setIsPlaying(false);
            }
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation()
        console.log(e)
        // e.preventDefault()
        const newTime = parseFloat(e.target.value);
        if (videoRef.current) {
            videoRef.current.currentTime = newTime;
            setCurrentTime(newTime)
        }
    };

    const handleVolumeChange = (e:React.ChangeEvent<HTMLInputElement>) =>{
        e.stopPropagation()
        let newVolume = parseFloat(e.target.value)
        setVolume(newVolume);
        if (videoRef.current) {
            setMuted(newVolume===0)
            videoRef.current.volume = newVolume;
        }
    }
    const handleVolumePlus = () =>{
        setVolume((prev)=>{
            let newVolume = (prev + .1)
            if(newVolume > 1){
                newVolume = 1;
            }
            if (videoRef.current) {
                setMuted(newVolume===0)
                videoRef.current.volume = newVolume;
            }
            return newVolume
        });
    }
    const handleVolumeMinus = () =>{
        setVolume((prevVolume) => {
            let newVolume = prevVolume - 0.1; // Diminui 10%
            if (newVolume < 0) {
                newVolume = 0; // Garante que o volume não fique abaixo de 0
            }
            if (videoRef.current) {
                setMuted(newVolume===0)
                videoRef.current.volume = newVolume;
            }
            return newVolume;
        });
    }

    const handleQualityChange = (v:quality) => {
        console.log(v)
        console.log(videoRef.current)
        if (videoRef.current) {
            const newSource = qualitySources[v];
            console.log(qualitySources);
            console.log(newSource)
            if (newSource) {
                const currentTimee = currentTime; // Armazena o tempo atual
                const isPlaying = !videoRef.current.paused; // Verifica se o vídeo está tocando
                console.log(currentTimee)
                // Atualiza a qualidade e a fonte do vídeo
                setCurrentQuality(v);
                videoRef.current.src = newSource;

                // Quando o novo vídeo começar a carregar
                videoRef.current.onloadedmetadata = () => {
                    if(videoRef.current){
                        // console.log()
                        videoRef.current.currentTime = currentTimee; // Restaura o tempo anterior
                        if (isPlaying) {
                            videoRef.current.play(); // Retoma a reprodução se estava tocando
                        }
                    }
                };
            }
        }
    };

    const handleToggleMuted = (e?:React.MouseEvent<HTMLButtonElement>)=>{
        e?.stopPropagation();
        setMuted((prev)=>!prev);
    }

    const handleForward = (e?:React.MouseEvent<HTMLButtonElement>) =>{
        e?.stopPropagation()
        if(videoRef.current){
            videoRef.current.currentTime += 10;
        }
    }
    const handleForward5 = () =>{
        if(videoRef.current){
            videoRef.current.currentTime += 5
        }
    }

    const handleBackward = (e?:React.MouseEvent<HTMLButtonElement>) =>{
        e?.stopPropagation()
        // console.log('cu')
        if(videoRef.current){
            videoRef.current.currentTime -= 10;
        }
    }
    const handleBackward5 = () =>{
        if(videoRef.current){
            videoRef.current.currentTime -= 5
        }
    }
    const toggleFullscreen = (e?:React.MouseEvent<HTMLButtonElement>) =>{
        e?.stopPropagation()
        setIsFullscreen(!isFullscreen);
        screenful.toggle(playerContainerRef.current!);
    }
    const toggleCaptions = (e:React.MouseEvent<HTMLButtonElement>)=>{
        e.stopPropagation();
        setCaptionsActive(!captionsActive);
    }
    const togglePiP = (e:React.MouseEvent<HTMLButtonElement>) =>{
        e.stopPropagation();
        togglePictureInPicture(!isPictureInPictureActive)
    }
    const toggleConfig = (e:React.MouseEvent)=>{
        e.stopPropagation();
        setIsConfigOpen(!isConfigOpen)
    }

    const handleVideoWrapperClick = (e:React.MouseEvent<HTMLDivElement>) =>{
        e.stopPropagation()
        togglePlayPause(e);
        setIsConfigOpen(false)
    }
    const handleSkipIntro = (e:React.MouseEvent<HTMLButtonElement>)=>{
        e.stopPropagation();
        if (videoRef.current) {
            videoRef.current.currentTime = ep.openingend;
        } else {
            console.warn("Video element not available");
        }
    }

    const handleSpeedChange = (v:number)=>{
        setCurrentSpeed(v)
        if(videoRef.current){
            videoRef.current.playbackRate = v
        }
    }

    //keyboard event listeners
    const handleKeyDown = (e:KeyboardEvent) =>{
        // console.log(document.activeElement)
        // if ((document.activeElement === playerContainerRef.current)) {
        switch (e.code) {
            case 'Space':
                e.preventDefault()
                togglePlayPause()
                break
            case 'KeyK':
                e.preventDefault()
                togglePlayPause()
                break
            case 'ArrowUp':
                e.preventDefault()
                handleVolumePlus()
                break
            case 'ArrowDown':
                e.preventDefault()
                handleVolumeMinus()
                break
            case 'ArrowRight':
                e.preventDefault()
                handleForward5()
                break
            case 'ArrowLeft':
                e.preventDefault()
                handleBackward5()
                break
            case 'KeyL':
                e.preventDefault()
                handleForward()
                break
            case 'KeyJ':
                e.preventDefault()
                handleBackward()
                break
            case 'KeyF':
                e.preventDefault()
                toggleFullscreen()
                break
            case 'KeyM':
                e.preventDefault()
                handleToggleMuted()
                break
        }
    }

    return (
        <div className={`player ${isConfigOpen||!isPlaying||isControlsVisible?'config-open':''}`} ref={playerContainerRef} >
            <div className='video-wrapper' onClick={handleVideoWrapperClick}>
                <video
                    src={qualitySources[currentQuality]}
                    poster={`${cdnUrl}/epPoster/${aniId}/${seasonId}/${ep.id}`}
                    muted={muted}
                    ref={videoRef}
                    onTimeUpdate={handleTimeUpdate}
                    onProgress={handleTimeUpdate}
                    // width={cu}
                >
                    {/*{Object.values(qualitySources).map(v=>(*/}
                    {/*    <source src={v}/>*/}
                    {/*))}*/}
                </video>
            </div>
            <Controls
                isPlaying={isPlaying}
                togglePlayPause={togglePlayPause}
                ep={ep}
                eps={eps}
                currentTime={currentTime}
                currentBuffer={currentBuffer}
                handleSeek={handleSeek}
                handleToggleMute={handleToggleMuted}
                muted={muted}
                volume={volume}
                handleVolumeChange={handleVolumeChange}
                handleBackward={handleBackward}
                handleForward={handleForward}
                toggleFullscreen={toggleFullscreen}
                isFullscreen={isFullscreen}
                toggleCaptions={toggleCaptions}
                captionsActive={captionsActive}
                isConfigOpen={isConfigOpen}
                toggleConfig={toggleConfig}
                selectedCaptions={selectedCaptions}
                setSelectedCaptions={setSelectedCaptions}
                currentSpeed={currentSpeed}
                handleSpeedChange={handleSpeedChange}
                currentQuality={currentQuality}
                handleQualityChange={handleQualityChange}
                handleSkipIntro={handleSkipIntro}
            />
            <Captions
                epId={ep.id}
                aniId={ep.anime_id}
                seasonId={ep.season_id}
                selectedCaptions={selectedCaptions}
                currentCue={currentCue}
                cueData={cueData}
                setCueData={setCueData}
                captionsActive={captionsActive}
            />
            <button className='play-button' style={{display: !isPlaying ? 'flex' : 'none'}}
                    onClick={togglePlayPause}>
                <FontAwesomeIcon icon={currentTime === ep.duration?faRepeat:!isPlaying?faPlay:faPause} />
            </button>
        </div>
    )
}
export default NewPlayer;
