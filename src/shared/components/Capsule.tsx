import { cva, type VariantProps } from "class-variance-authority";

const capsule = cva(
  "w-fit px-2 py-1 rounded-full text-sm whitespace-nowrap transition-all duration-100 select-none",
  {
    variants: {
      type: {
        category: "text-black bg-pastelblue",
        date: "text-black bg-pastelblue",
        isOnline: "text-black bg-pastelred",
        status: "text-black bg-pastelgreen cursor-default",
        participant: "text-mainred bg-pastelblue shadow-sm cursor-default",
      },
      selected: {
        true: "font-medium",
        false: "font-light",
      },
      readOnly: {
        true: "cursor-default",
        false: "cursor-pointer",
      },
    },
    compoundVariants: [
      {
        type: ["category", "date"],
        selected: false,
        readOnly: false,
        className: "hover:bg-pastelblue-selected hover:shadow-sm",
      },
      {
        type: ["category", "date"],
        selected: true,
        readOnly: false,
        className:
          "bg-pastelblue-selected ring-1 ring-pastelblue-border shadow-sm",
      },
      {
        type: "isOnline",
        selected: false,
        readOnly: false,
        className: "hover:bg-pastelred-selected hover:shadow-sm",
      },
      {
        type: "isOnline",
        selected: true,
        readOnly: false,
        className:
          "bg-pastelred-selected ring-1 ring-pastelred-border shadow-sm",
      },
    ],
    defaultVariants: {
      type: "category",
      selected: false,
      readOnly: false,
    },
  }
);

interface CapsuleProps extends VariantProps<typeof capsule> {
  text: string;
  onClick?: () => void;
}

function Capsule({
  text,
  type,
  selected = false,
  readOnly = false,
  onClick,
}: CapsuleProps) {
  const readOnlyCapsule = type === "status" || type === "participant";
  const isReadOnly = readOnlyCapsule || readOnly;
  const isSelected = readOnlyCapsule ? false : selected;
  return (
    <button
      type="button"
      className={capsule({
        type,
        selected: isSelected,
        readOnly: isReadOnly,
      })}
      onClick={isReadOnly ? undefined : onClick}
      aria-pressed={!isReadOnly ? selected ?? false : false}
      aria-label={`${text} ${type}`}
      disabled={isReadOnly ?? false}
    >
      {text}
    </button>
  );
}

export default Capsule;
