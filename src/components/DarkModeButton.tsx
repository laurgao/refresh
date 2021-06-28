import { FaMoon } from "react-icons/fa";
import Button from "./Button";

function DarkModeButton( {onToggle, className=""} : {onToggle: any, className?: string} ) {
    return (
        <Button className={`dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800 text-black ${className}`} onClick={onToggle}>
            <FaMoon />
        </Button>
    )
}

export default DarkModeButton