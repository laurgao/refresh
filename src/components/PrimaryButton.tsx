import Button from "./Button";

const PrimaryButton = ({onClick, children, href, isLoading, isDisabled, className} : {
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
            className={`bg-red-700 text-white hover:bg-black ${className && className}`}
        >{children}</Button>
    )
}

export default PrimaryButton