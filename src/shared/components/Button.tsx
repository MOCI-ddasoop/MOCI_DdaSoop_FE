import { cva, VariantProps } from "class-variance-authority"
import tw from "../utils/tw";


const buttonVariants = cva(
    "rounded-lg inline-flex items-center justify-center whitespace-nowrap transition-colors duration-150 disabled:bg-gray disabled:text-black disabled:cursor-not-allowed",
    {
      variants: {
        size: {
            sm : "px-1 py-2 w-fit h-fit text-sm",
            md : "px-3 py-3 w-fit h-fit text-base",
        },
        color:{
            skyblue : "bg-skyBlue text-black hover:ring-2 hover:ring-mainblue disabled:hover:ring-0",
            red : "bg-mainred text-white hover:ring-2 hover:ring-mainred-hover disabled:hover:ring-0", 
        } 
      },
      //기본 값 : 하늘색 md 사이즈 버튼 
      defaultVariants: {
        size: "md",
        color: "skyblue",
      },
    }
  );

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants> & {
    hasIcon ?: boolean;
    fullWidth ?: boolean;
};

function Button({
    size,
    color,
    hasIcon = false,
    fullWidth = false,
    className,
    children,
    ...rest
}: ButtonProps) {
  return (
   <button
    type="button"
    className={tw(
        buttonVariants({size, color}),
        hasIcon && "gap-6.5",
        fullWidth && "w-full",
        className,
    )}
    {...rest}
   >
    {children}
    </button>
  );
}

export default Button;