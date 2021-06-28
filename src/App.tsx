import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import Modal from "react-modal";
import "./App.css";
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
        localStorage.theme == 'dark' ? localStorage.theme = "light" : localStorage.theme = "dark"
    }

    
    const [breakLength, setBreakLength] = useState<number>(5);
    const [screenTimeLength, setScreenTimeLength] = useState<number>(60);
    useEffect(() => {
        if (!('breakLength' in localStorage)) console.log("F") // is first time
        else setBreakLength(localStorage.breakLength) 
    }, [])

    const onSettingsSubmit = () => {
        localStorage.breakLength = breakLength
        setIsSettings(false);
    }

    const [state, setState] = useState<"Break"|"Screen time"|"other">("Screen time");
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

    useEffect(() => {
        // When state changes, start timer.
        setStartTime(new Date());
        setTimeLeft(calculateTimeLeft())
    }, [state])

    useEffect(() => {
        setState("Screen time");
    }, [state == "Break" && timeLeft?.minutes == breakLength])

    useEffect(() => {
        if (timeLeft && timeLeft.minutes >= screenTimeLength) setState("Break");
    }, [state == "Screen time" && timeLeft?.minutes == screenTimeLength])
    console.log(isSettings)

    return (
        <div className="px-4 bg-white dark:bg-black">
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
                        onChange={e => localStorage.screenTimeLength = e.target.value}
                        placeholder="60"
                        value={localStorage.screenTimeLength}
                    /> minutes</p>
                <PrimaryButton onClick={onSettingsSubmit}>Save</PrimaryButton>
                
                </div>
                </>
            </Modal>
            <Navbar toggleDarkMode={toggleDarkMode} state={state} setState={setState} setIsSettings={setIsSettings}/>
            <div className="max-w-5xl mx-auto px-4">
                <div className="flex items-center justify-center w-full h-screen">
                    <div>
                        {(state == "Screen time" || state == "Break") && timeLeft && <div className="text-2xl text-gray-700 dark:text-gray-300">
                            {state} elapsed: {screenTimeLength > 60 && `${timeLeft.hours} : `}{timeLeft.minutes < 10 && "0"}
                            {timeLeft.minutes} : {timeLeft.seconds < 10 && "0"}
                            {timeLeft.seconds}
                        </div>}
                        {state == "other" && <PrimaryButton onClick={() => setState("Screen time")}>Start</PrimaryButton>}
                    </div>
                  
                </div>

            </div>
        </div> 
    );
}

export default App;
