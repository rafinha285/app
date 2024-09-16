import React, {useState} from "react";
import {quality, qualityEnum} from "../../../types/types";
import {Episode} from "../../../types/episodeModel";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretLeft, faCaretRight} from "@fortawesome/free-solid-svg-icons";

type pages = 'main' | 'quality' | 'speed' | 'captions'

interface SettingsOption {
    label: string;
    value: string|number|quality;
    badge?: string;
}
interface SettingsMenuProps{
    type:pages;
    title: string;
    options: SettingsOption[];
    currentOption: string|number;
    onBack: () => void;
    onSelect: (value: string | number | quality) => void;
}
const SettingsMenu:React.FC<SettingsMenuProps> = ({type,title,options,currentOption,onBack,onSelect}) =>{
    console.log(currentOption);
    return(
        <div>
            <button className='back-button config-popup-inner' onClick={onBack}>
                <FontAwesomeIcon icon={faCaretLeft}/>
                <span>{title}</span>
            </button>
            <div role="menu" className="config-menu">
                {options.map((option) => (
                    <button
                        key={option.value}
                        type="button"
                        role="menuitemradio"
                        className={`config-popup-inner ${
                            type !== 'quality'? 
                                currentOption === option.value?
                                    'option-checked':
                                    ''
                                :currentOption=== parseInt(option.value as string)?
                                    'option-checked':
                                    ''
                        }`}
                        aria-checked={currentOption === option.value}
                        value={option.value}
                        onClick={() => onSelect(option.value)}
                    >
                        <span>{option.label}</span>
                        {option.badge &&
                            <span className="badge">{option.badge}</span>
                        }
                    </button>
                ))}
            </div>
        </div>
    )
}

interface props {
    selectedCaptions: string;
    setSelectedCaptions:React.Dispatch<React.SetStateAction<string>>;
    currentQuality: quality
    handleQualityChange:(v:quality) => void;
    currentSpeed:number;
    handleSpeedChange:(v:number) => void;
    ep:Episode
}
const VideoPlayerSettings:React.FC<props> = (
    {
        selectedCaptions,
        setSelectedCaptions,
        currentQuality,
        handleQualityChange,
        currentSpeed,
        handleSpeedChange,
        ep
    }) =>{

    const [activeMenu, setActiveMenu] = useState<pages>('main');
    const qualityOptions:SettingsOption[] = ep.resolution.map(v=>{
        const resolution = v.split('x')[1]

        return {
            label: `${resolution}p`,
            value: resolution,
            badge: resolution
        }
    })
    // qualityOptions.unshift({label:'Automatico',value:-1,badge:"AUTO"})
    const captionsOptions = ep.subtitlestracks!.map(v=>{
       return {
           label: v,
           value: v,
       }
    })
    const speedOptions: SettingsOption[] = [
        { label: '0.5×', value: 0.5 },
        { label: '0.75×', value: 0.75 },
        { label: 'Normal', value: 1 },
        { label: '1.25×', value: 1.25 },
        { label: '1.5×', value: 1.5 },
        { label: '2×', value: 2 },
    ];

    const handleNextPage = (e:React.MouseEvent<HTMLButtonElement> ,v:pages) =>{
        e.stopPropagation()
        setActiveMenu(v)
    }

    return(
        <div className="config-popup" onClick={(e)=>e.stopPropagation()}>
            {activeMenu === 'main' &&(
                <div>
                    <button  className='config-popup-inner' onClick={(e)=>handleNextPage(e,'quality')}>
                        <span>Resolução: </span>
                        <div>
                            <span>{currentQuality}</span>
                            <FontAwesomeIcon icon={faCaretRight}/>
                        </div>
                    </button>
                    <button className="config-popup-inner" onClick={(e)=>handleNextPage(e,'captions')}>
                        <span>Legendas: </span>
                        <div>
                            <span>{selectedCaptions}</span>
                            <FontAwesomeIcon icon={faCaretRight}/>
                        </div>
                    </button>
                    <button className="config-popup-inner" onClick={(e)=>handleNextPage(e,'speed')}>
                        <span>Velocidade: </span>
                        <div>
                            <span>{currentSpeed}x</span>
                            <FontAwesomeIcon icon={faCaretRight}/>
                        </div>
                    </button>
                </div>
            )}

            {activeMenu === 'quality' && (
                <SettingsMenu
                    type={'quality'}
                    title="Resolução"
                    options={qualityOptions}
                    currentOption={currentQuality}
                    onBack={()=>setActiveMenu('main')}
                    onSelect={(v)=>handleQualityChange(v as quality)}
                />
            )}

            {activeMenu === 'captions' && (
                <SettingsMenu
                    type={'captions'}
                    title="Legendas"
                    options={captionsOptions}
                    currentOption={selectedCaptions}
                    onSelect={(e)=>setSelectedCaptions(e as string)}
                    onBack={()=>setActiveMenu('main')}
                />
            )}

            {activeMenu === 'speed' && (
                <SettingsMenu
                    type={'speed'}
                    title="Velocidade"
                    options={speedOptions}
                    currentOption={currentSpeed}
                    onSelect={(e)=>handleSpeedChange(e as number)}
                    onBack={()=>setActiveMenu('main')}
                />
            )}
        </div>
    )
}
export default VideoPlayerSettings;
