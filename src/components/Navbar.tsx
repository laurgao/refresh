
import { FaCog } from "react-icons/fa";
import PrimaryButton from "./PrimaryButton";
import TextButton from "./TextButton";

const Navbar = ({toggleDarkMode, state, onTakeBreak, setIsSettings}: {toggleDarkMode: any, state: "Screen time"|string, onTakeBreak: () => any, setIsSettings: any}) => {
    return (
        <nav className="absolute top-0 z-30 flex items-center w-11/12 mx-auto">
            <div className="h-16 flex items-center mr-auto">
                <p className="text-2xl font-bold mt-1.5"></p>
            </div>
            
            <div className="flex flex-row gap-4">
                {/* <DarkModeButton onToggle={toggleDarkMode}/> */}
                <TextButton onClick={() => setIsSettings(true)}><FaCog /></TextButton>
                {state === "Screen time" && <PrimaryButton onClick={onTakeBreak}>Take Break</PrimaryButton>}
            </div>
        </nav>
    )
}

export default Navbar
