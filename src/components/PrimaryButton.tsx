import Button from "./Button";

const PrimaryButton = ({onClick, children, href, isLoading, isDisabled, className = ""} : {
    onClick?: any,
    children: any,
    href?: string,
    isLoading?: boolean,
    isDisabled?: boolean,
    className?: string,
}) => {
    return (
        <Button 
            onClick={onClick}
            href={href} 
            isLoading={isLoading} 
            isDisabled={isDisabled}
            className={`bg-red-700 text-white ${(!isDisabled && !isLoading) && "hover:bg-black"} ${className}`}
        >{children}</Button>
    )
}

export default PrimaryButton