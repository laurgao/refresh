import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import Modal from "react-modal";
import Sound from "react-sound";
import "./App.css";
import Button from "./components/Button";
import Navbar from "./components/Navbar";
import PrimaryButton from "./components/PrimaryButton";

function App() {
    interface timeObj {
        minutes: number,
        hours: number,
        seconds: number
    }
    useEffect(() => {
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }, [localStorage.theme])
    
    const toggleDarkMode = () => {
        localStorage.theme === 'dark' ? localStorage.theme = "light" : localStorage.theme = "dark"
    }

    
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
    const [startTime, setStartTime] = useState<Date>();
    
    const calculateTimeLeft = () => {
        if (!startTime) return;
        const difference: number = +new Date() - +startTime; // + casts date to integer in microseconds
        let timeLeft: any = {};

        if (difference > 0) {
            timeLeft = {
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60)
            };
        }
        return timeLeft; 
    };

    const [timeLeft, setTimeLeft] = useState<timeObj>();

    useEffect(() => {
        const timer = setTimeout(() => {
          setTimeLeft(calculateTimeLeft());
        }, 1000);
        // Clear timeout if the component is unmounted
        return () => clearTimeout(timer);

    });

    useEffect(() => {
        setStartTime(new Date());
        setTimeLeft(calculateTimeLeft())
    }, []) 

    // useEffect(() => {
    //     // When state changes, start timer.
    //     setStartTime(new Date());
    //     setTimeLeft(calculateTimeLeft());
    //     setState("Screen time");
    // }, [state])

    useEffect(() => {
        // setState("Screen time");
        if (timeLeft && timeLeft.minutes >= Number(breakLength)) {
            
            if (state === "Break") setState("Break over");
            else if (state === "Screen time"){
                setState("Break");
                setSoundStatus("PLAYING")
                // start timer.
                setStartTime(new Date());
                let tl = calculateTimeLeft()
                setTimeLeft(tl);
            }
        }
    }, [timeLeft])

    const [soundStatus, setSoundStatus] = useState<"PLAYING"|"STOPPED">("STOPPED");
    console.log(soundStatus)
    // if (timeLeft) console.log(state === "Screen time" && timeLeft?.minutes === Number(localStorage.screenTimeLength))

    return (
        <div className={`px-4 ${state === "Break" ? "dark:bg-red bg-red" : "bg-white dark:bg-black"}`}>
            <Button className="dark:text-white dark:border-black z-40" onClick={() => console.log("useless")}>Current state: {state}</Button>
            <Sound
                url="https://glpro.s3.amazonaws.com/_util/smpte/111.mp3"
                playStatus={soundStatus}
                playFromPosition={300 }
                
                // onLoading={handleSongLoading}
                // onPlaying={handleSongPlaying}
                onFinishedPlaying={() => setSoundStatus("STOPPED")}
            />
            
            {/* {soundStatus==="PLAYING" && <audio controls autoPlay className="z-40 absolute">
                <source src="https://glpro.s3.amazonaws.com/_util/smpte/111.mp3" type="audio/mp3"/>
            </audio>} */}
            {/* <audio controls autoPlay className="z-40 absolute">
                <source src="https://glpro.s3.amazonaws.com/_util/smpte/111.mp3" type="audio/mp3"/>
            </audio>
            <iframe src="https://glpro.s3.amazonaws.com/_util/smpte/111.mp3" allow="autoplay">
    </iframe>  */}
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
            <Navbar toggleDarkMode={toggleDarkMode} state={state} onTakeBreak={
                () => {
                    setState("Break");
                        // start timer.
                    setStartTime(new Date());
                    setTimeLeft(calculateTimeLeft());
                }
            } setIsSettings={setIsSettings}/>
            <div className="max-w-5xl mx-auto px-4">
                <div className="flex items-center justify-center w-full h-screen">
                    <div className="text-center">
                        {(state === "Screen time" || state === "Break") && timeLeft && <div className="text-gray-700 dark:text-gray-300">
                            <p className="time text-8xl">{screenTimeLength > 60 && `${timeLeft.hours} : `}{timeLeft.minutes < 10 && "0"}
                            {timeLeft.minutes} : {timeLeft.seconds < 10 && "0"}
                            {timeLeft.seconds}</p>                            
                            <p className="opacity-50 mt-2">{state} elapsed</p>
                        </div>}
                        {state === "Break over" && <div className="text-gray-700 dark:text-gray-300">
                            <p className="time text-8xl">Break over</p> 
                            <PrimaryButton onClick={() => {
                                // start timer.
                                setStartTime(new Date());
                                setTimeLeft(calculateTimeLeft());
                                setState("Screen time");
                                setSoundStatus("STOPPED")
                                }}>I'm back!</PrimaryButton>
                        </div>}
                        {state === "other" && <PrimaryButton onClick={() => {setState("Screen time")}}>Start</PrimaryButton>}
                    </div>
                  
                </div>

            </div>
        </div> 
    );
}

export default App;
