import { ReactNode, useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import Modal from "react-modal";
import Sound from "react-sound";
import "./App.css";
import Navbar from "./components/Navbar";
import PrimaryButton from "./components/PrimaryButton";


const isNaturalNumber = (str: any): boolean => !isNaN(str) && Number.isInteger(parseFloat(str)) && Number(str) > 0;

interface timeObj {
    minutes: number,
    seconds: number
}
    
function calculateElapsedTime(startTime: Date): timeObj {
    // helper function that returns amount of time from `startTime` to now.
    const difference: number = +new Date() - +startTime; // + casts date to integer in microseconds
    let elapsedTime: any = {};

    if (difference > 0) {
        elapsedTime = {
            minutes: Math.floor((difference / 1000 / 60)),
            seconds: Math.floor((difference / 1000) % 60)
        };
    }
    return elapsedTime; 
};

function App() {

    useEffect(() => {
        if (!('breakLength' in localStorage)) {
            // is first time
            localStorage.breakLength = 5;
            setBreakLength(5);
        }
        if(!("screenTimeLength" in localStorage)) {
            localStorage.screenTimeLength = 60;
            setScreenTimeLength(60);
        }
        
        const sound = new Audio("https://glpro.s3.amazonaws.com/_util/smpte/111.mp3")
        sound.muted = true;
        sound.play();
    }, [])    
    
    const [breakLength, setBreakLength] = useState(localStorage.breakLength);
    const [screenTimeLength, setScreenTimeLength] = useState(localStorage.screenTimeLength);

    const onSettingsSubmit = () => {
        localStorage.breakLength = Number(breakLength);
        localStorage.screenTimeLength = Number(screenTimeLength);
        setIsSettings(false);
    }

    const [state, setState] = useState<"Break"|"Screen time"|"Break over"|"other">("Screen time");
    const [isSettings, setIsSettings] = useState<boolean>(false);
    const [isInstall, setIsInstall] = useState<boolean>(false);
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
        <>
        <div className={`px-4 h-screen flex items-center justify-center text-center ${(state === "Break" || state === "Break over") ? "bg-red-500" : "bg-white dark:bg-black"}`}>
            <Sound
                url="https://glpro.s3.amazonaws.com/_util/smpte/111.mp3"
                playStatus={soundStatus}
                onFinishedPlaying={() => setSoundStatus("STOPPED")}
            />

            <MyModal isOpen={isInstall} onRequestClose={() => setIsInstall(false)}>
                <>
                <h1 className="font-bold text-xl text-center mb-8">Download the Refresh desktop app</h1>
                <div className="flex items-center justify-center">
                    <PrimaryButton href="https://www.dropbox.com/s/q8qyktktb4xmfb6/Refresh%20Setup%200.1.0.exe?dl=1">Windows</PrimaryButton>
                </div>
                <p className="text-right mt-12 sm:w-2/3 ml-auto text-xs text-gray-400">Support for MacOS and Linux will come once Laura figures out how to get Electron.js to build installers for those operating systems on her Windows laptop.</p>
                </>
            </MyModal>
            
            <MyModal
                isOpen = {isSettings}
                onRequestClose={() => {
                    setIsSettings(false);
                    setScreenTimeLength(localStorage.screenTimeLength)
                    setBreakLength(localStorage.breakLength)
                }}
            >
                <>
                <div className="flex items-center flex-col justify-center w-full h-full text-center">
                    <p>Take a <input 
                        value={breakLength} 
                        onChange={e => setBreakLength(e.target.value)}
                        placeholder="5"
                        className="border border-black mx-2 rounded-md p-2 my-1 w-16"
                    /> minute break every <input 
                        onChange={e => setScreenTimeLength(e.target.value)}
                        placeholder="60"
                        value={screenTimeLength}
                        className="border border-black mx-2 rounded-md p-2 my-1 w-16"
                    /> minutes</p>
                    
                    <PrimaryButton onClick={onSettingsSubmit} className="mt-12" isDisabled={
                        !isNaturalNumber(screenTimeLength) || !isNaturalNumber(breakLength)
                    }>Save</PrimaryButton>
                </div>
                </>
            </MyModal>
            <Navbar state={state} onTakeBreak={
                () => {
                        // start timer.
                    setStartTime(new Date());
                    setTimeElapsed(calculateElapsedTime(new Date()));
                    setState("Break");
                }
            } setIsSettings={setIsSettings} setIsInstall={setIsInstall}/>
            <div className="max-w-5xl mx-auto px-4">
                {(state === "Screen time" || state === "Break") && <div className="text-black opacity-60 dark:text-white dark:opacity-80">
                    <p className="time text-8xl">
                        {(timeElapsed.minutes && timeElapsed.minutes >= 60) ? `${Math.floor(timeElapsed.minutes / 60)} : ` : ""}
                        {(!timeElapsed.minutes || timeElapsed.minutes % 60 < 10) && 0}{timeElapsed.minutes % 60 || 0}
                        {" "}:{" "}
                        {(!timeElapsed.seconds || timeElapsed.seconds < 10) && 0}{timeElapsed.seconds || 0}
                    </p>                            
                    <p className="opacity-50 mt-2">{state} elapsed</p>
                </div>}
                {state === "Break over" && <>
                    <p className="time text-8xl text-black opacity-60 dark:text-white dark:opacity-80">Break over</p> 
                    <PrimaryButton className="mt-4" onClick={() => {
                        // start timer.
                        setStartTime(new Date());
                        setTimeElapsed(calculateElapsedTime(new Date()));
                        setState("Screen time");
                        setSoundStatus("STOPPED");
                        }}>I'm back!</PrimaryButton>
                </>}
                {state === "other" && <PrimaryButton onClick={() => {
                    setStartTime(new Date());
                    setTimeElapsed(calculateElapsedTime(new Date()));
                    setState("Screen time")
                }}>Start</PrimaryButton>}

            </div>
        </div> 

        <p className="absolute bottom-4 right-0 text-right mx-8 opacity-30 hover:opacity-50 text-black dark:text-white transition text-sm">
            Keep this tab constantly open in the background, and Refresh will remind you to take a break whenever your screen
            time is up.
        </p>
        </>
    );
}

export default App;

function MyModal({isOpen, onRequestClose, children}: {isOpen: boolean, onRequestClose: () => any, children: ReactNode}) {
    return (
        <Modal
            isOpen ={isOpen}
            onRequestClose={onRequestClose}
            className="top-24 left-1/2 fixed bg-white p-8 rounded-md shadow-xl mx-4"
            style={{content: {transform: "translateX(calc(-50% - 16px))", maxWidth: "calc(100% - 32px)", width: 700}, overlay: {zIndex: 50}}}
        >
            <>
            <div className="absolute">
                <FaTimes onClick={onRequestClose} className="black dark:white cursor-pointer opacity-70"/>
            </div>
            <div className="mt-8">
                {children}
            </div>
            </>
        </Modal>
    )
}