
import { FaCog } from "react-icons/fa";
import TextButton from "./DarkModeButton";
import PrimaryButton from "./PrimaryButton";

const Navbar = ({toggleDarkMode, state, onTakeBreak, setIsSettings}: {toggleDarkMode: any, state: "Screen time"|string, onTakeBreak: () => any, setIsSettings: any}) => {
    return (
        <nav className="absolute top-0 z-30 flex items-center w-11/12 mx-auto">
            <div className="h-16 flex items-center mr-auto">
                <p className="text-2xl font-bold mt-1.5"></p>
            </div>
            
            <div className="flex flex-row">
                {/* <DarkModeButton onToggle={toggleDarkMode}/> */}
                {state === "Screen time" && <PrimaryButton onClick={onTakeBreak}>Take Break</PrimaryButton>}
                <TextButton onClick={() => setIsSettings(true)}><FaCog /></TextButton>
            </div>
        </nav>
    )
}

export default Navbar
