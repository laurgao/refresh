
import { Dispatch, SetStateAction, useEffect } from "react";
import { FaCog, FaMoon, FaDownload } from "react-icons/fa";
import PrimaryButton from "./PrimaryButton";
import TextButton from "./TextButton";

const Navbar = ({state, onTakeBreak, setIsSettings}: {
    state: "Screen time"|string, onTakeBreak: () => any, 
    setIsSettings: Dispatch<SetStateAction<boolean>>, 
}) => {
    useEffect(() => {
        if (localStorage.theme === 'dark' || (!('theme' in localStorage))) { //  && window.matchMedia('(prefers-color-scheme: dark)').matches
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }, [])
    
    const toggleDarkMode = () => {
        localStorage.theme === 'dark' ? localStorage.theme = "light" : localStorage.theme = "dark"
        if (localStorage.theme === 'dark') document.documentElement.classList.add('dark')
        else document.documentElement.classList.remove('dark')
    }
    return (
        <nav className="fixed top-0 z-30 flex items-center w-11/12 mx-auto">
            <div className="h-16 flex items-center mr-auto">
                <p className="text-2xl font-bold mt-1.5"></p>
            </div>
            
            <div className="flex flex-row gap-4">
                <TextButton onClick={toggleDarkMode}><FaMoon /></TextButton>
                <TextButton onClick={() => setIsSettings(true)}><FaCog /></TextButton>
                {state === "Screen time" && <PrimaryButton onClick={onTakeBreak}>Take break</PrimaryButton>}
            </div>
        </nav>
    )
}

export default Navbar
