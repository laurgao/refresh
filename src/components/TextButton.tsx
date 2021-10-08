import { ReactNode } from "react";
import Button from "./Button";

function TextButton( {onClick, className="", children} : {onClick: any, className?: string, children: ReactNode} ) {
    return (
        <Button className={`dark:text-white hover:bg-black dark:hover:bg-gray-100 dark:hover:bg-opacity-10 hover:bg-opacity-20 text-black ${className}`} onClick={onClick}>
            {children}
        </Button>
    )
}

export default TextButton