import {
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
} from "@floating-ui/react";
import { useState } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { BsThreeDots, BsThreeDotsVertical } from "react-icons/bs";
import tw from "../utils/tw";

const dropdownButton = cva(
  "relative cursor-pointer rounded-md p-2 transition-all duration-200",
  {
    variants: {
      variant: {
        primary: "hover:bg-gray-100 text-gray-500",
        secondary: "hover:bg-blue-50 text-mainblue",
        danger: "hover:bg-red-50 text-mainred",
      },
      size: {
        sm: "p-1",
        md: "p-2",
        lg: "p-3",
      },
      disabled: {
        true: "cursor-not-allowed opacity-50",
        false: "cursor-pointer",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      disabled: false,
    },
  }
);

const dropdownMenu = cva(
  "bg-white rounded-md shadow-md border border-gray-200 z-50",
  {
    variants: {
      size: {
        sm: "min-w-16",
        md: "min-w-24",
        lg: "min-w-28",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

const dropdownItem = cva(
  "cursor-pointer transition-colors duration-150 first:rounded-t-md last:rounded-b-md hover:inset-shadow-sm",
  {
    variants: {
      variant: {
        default: "hover:bg-gray-100 text-gray-700",
        secondary: "hover:bg-blue-50 text-mainblue",
        danger: "hover:bg-red-50 text-mainred",
        success: "hover:bg-green-50 text-pastelgreen",
      },
      size: {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-5 py-3 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

interface DropdownButtonProps extends VariantProps<typeof dropdownButton> {
  options: string[];
  selected: string;
  setSelected: (selected: string) => void;
  className?: string;
  menuSize?: VariantProps<typeof dropdownMenu>["size"];
  itemVariant?: VariantProps<typeof dropdownItem>["variant"];
  placement?:
    | "bottom-start"
    | "bottom-end"
    | "top-start"
    | "top-end"
    | "bottom";
  hilightingLastOption?: boolean;
  buttonStyle?: "vertical" | "horizontal";
}

function DropdownButton({
  options,
  selected,
  setSelected,
  className,
  variant = "primary",
  size = "md",
  disabled = false,
  menuSize = "md",
  itemVariant = "default",
  placement = "bottom",
  hilightingLastOption = false,
  buttonStyle = "vertical",
}: DropdownButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    placement,
    open: isOpen,
    onOpenChange: setIsOpen,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
  ]);

  const { setReference, setFloating } = refs;

  const handleOptionClick = (option: string) => {
    setSelected(option);
    setIsOpen(false);
  };

  return (
    <>
      <button
        ref={setReference}
        {...getReferenceProps()}
        className={tw(
          dropdownButton({
            variant,
            size,
            disabled,
          }),
          className,
          // 열린 상태면 항상 보이도록 설정
          isOpen && "opacity-100"
        )}
        disabled={disabled ?? false}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        {buttonStyle === "vertical" ? (
          <BsThreeDotsVertical
            size={size === "sm" ? 16 : size === "lg" ? 28 : 24}
            className="transition-transform duration-200"
          />
        ) : (
          <BsThreeDots
            size={size === "sm" ? 16 : size === "lg" ? 28 : 24}
            className="transition-transform duration-200"
          />
        )}
      </button>

      {isOpen && (
        <ul
          ref={setFloating}
          {...getFloatingProps()}
          style={floatingStyles}
          className={dropdownMenu({ size: menuSize })}
          role="listbox"
        >
          {options.map((option, index) => (
            <li
              key={option}
              onClick={() => handleOptionClick(option)}
              className={dropdownItem({
                variant:
                  itemVariant &&
                  hilightingLastOption &&
                  index === options.length - 1
                    ? "danger"
                    : itemVariant,
                size,
                className: tw("flex items-center justify-center"),
              })}
              role="option"
              aria-selected={option === selected}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default DropdownButton;
