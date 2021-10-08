import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import Modal from "react-modal";
import Sound from "react-sound";
import "./App.css";
import Navbar from "./components/Navbar";
import PrimaryButton from "./components/PrimaryButton";


interface timeObj {
    minutes: number,
    hours: number,
    seconds: number
}
    
function calculateElapsedTime(startTime: Date): timeObj {
    // helper function that returns amount of time from `startTime` to now.
    const difference: number = +new Date() - +startTime; // + casts date to integer in microseconds
    let elapsedTime: any = {};

    if (difference > 0) {
        elapsedTime = {
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60)
        };
    }
    return elapsedTime; 
};

function App() {

    
    const [breakLength, setBreakLength] = useState<number>(5);
    const [screenTimeLength, setScreenTimeLength] = useState<number>(60);
    useEffect(() => {
        if (!('breakLength' in localStorage)) localStorage.breakLength = 5 // is first time
        setBreakLength(localStorage.breakLength) 

        if(!("screenTimeLength" in localStorage)) localStorage.screenTimeLength = 60
        setScreenTimeLength(localStorage.screenTimeLength)
    }, [])

    const onSettingsSubmit = () => {
        localStorage.breakLength = breakLength;
        localStorage.screenTimeLength = screenTimeLength;
        setIsSettings(false);
    }

    const [state, setState] = useState<"Break"|"Screen time"|"Break over"|"other">("Screen time");
    const [isSettings, setIsSettings] = useState<boolean>(false);
    const [startTime, setStartTime] = useState<Date>(new Date());

    const [timeElapsed, setTimeElapsed] = useState<timeObj>(calculateElapsedTime(new Date()));

    useEffect(() => {
        const timer = setTimeout(() => {
          setTimeElapsed(calculateElapsedTime(startTime));
        }, 1000);
        // Clear timeout if the component is unmounted
        return () => clearTimeout(timer);

    });

    const exceededBreakLength: boolean = timeElapsed && timeElapsed.minutes >= Number(localStorage.breakLength)
    const exceededScreenTimeLength: boolean = timeElapsed && timeElapsed.minutes >= Number(localStorage.screenTimeLength)
    useEffect(() => {
        if (exceededBreakLength && state === "Break") {
            setState("Break over");
        }
    }, [exceededBreakLength, state, startTime])
    useEffect(() => {
        if (exceededScreenTimeLength && state === "Screen time"){
            setSoundStatus("PLAYING")
            // start timer.
            setStartTime(new Date());
            setTimeElapsed(calculateElapsedTime(new Date()));
            setState("Break");
        }
    }, [exceededScreenTimeLength, state, startTime])

    const [soundStatus, setSoundStatus] = useState<"PLAYING"|"STOPPED">("STOPPED");

    return (
        <div className={`px-4 h-screen flex items-center justify-center text-center ${(state === "Break" || state === "Break over") ? "bg-red-500" : "bg-white dark:bg-black"}`}>
            <Sound
                url="https://glpro.s3.amazonaws.com/_util/smpte/111.mp3"
                playStatus={soundStatus}
                // playFromPosition={300}
                onFinishedPlaying={() => setSoundStatus("STOPPED")}
            />
            
            <Modal
                isOpen = {isSettings}
                onRequestClose={() => setIsSettings(false)}
                className="z-40 w-full h-full "
            >
                <>
                <div className="absolute">
                    <FaTimes onClick={() => setIsSettings(false)} className="black dark:white cursor-pointer opacity-70"/>
                </div>
                <div className="flex items-center flex-col justify-center w-full h-full">
                    <p>Take <input 
                        value={breakLength} 
                        onChange={e => setBreakLength(Number(e.target.value))}
                        placeholder="5"
                    /> minute break every <input 
                        onChange={e => setScreenTimeLength(Number(e.target.value))}
                        placeholder="60"
                        value={screenTimeLength}
                    /> minutes</p>
                    
                    <PrimaryButton onClick={onSettingsSubmit}>Save</PrimaryButton>
                </div>
                </>
            </Modal>
            <Navbar state={state} onTakeBreak={
                () => {
                        // start timer.
                    setStartTime(new Date());
                    setTimeElapsed(calculateElapsedTime(new Date()));
                    setState("Break");
                }
            } setIsSettings={setIsSettings}/>
            <div className="max-w-5xl mx-auto px-4">
                {(state === "Screen time" || state === "Break") && <div className="text-gray-700 dark:text-gray-300">
                    <p className="time text-8xl">{!!(timeElapsed.hours) && `${timeElapsed.hours} : `}{(!timeElapsed.minutes || timeElapsed.minutes < 10) && 0}
                    {timeElapsed.minutes || 0} : {(!timeElapsed.seconds || timeElapsed.seconds < 10) && 0}
                    {timeElapsed.seconds || 0}</p>                            
                    <p className="opacity-50 mt-2">{state} elapsed</p>
                </div>}
                {state === "Break over" && <div className="text-gray-700 dark:text-gray-300">
                    <p className="time text-8xl">Break over</p> 
                    <PrimaryButton className="mt-4" onClick={() => {
                        // start timer.
                        setStartTime(new Date());
                        setTimeElapsed(calculateElapsedTime(new Date()));
                        setState("Screen time");
                        setSoundStatus("STOPPED");
                        }}>I'm back!</PrimaryButton>
                </div>}
                {state === "other" && <PrimaryButton onClick={() => {
                    setStartTime(new Date());
                    setTimeElapsed(calculateElapsedTime(new Date()));
                    setState("Screen time")
                }}>Start</PrimaryButton>}

            </div>
        </div> 
    );
}

export default App;
