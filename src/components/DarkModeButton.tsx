import { ReactNode } from "react";
import Button from "./Button";

function TextButton( {onClick, className="", children} : {onClick: any, className?: string, children: ReactNode} ) {
    return (
        <Button className={`dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800 text-black ${className}`} onClick={onClick}>
            {children}
        </Button>
    )
}

export default TextButton