import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Button from "@/shared/components/Button";
import { formatMoney } from "../utils/formatMoney";

function DonateModal({
  onClose,
  title,
  organization,
}: {
  onClose: () => void;
  title: string;
  organization: string;
}) {
  const moneyList = [
    "5천원",
    "1만원",
    "3만원",
    "5만원",
    "10만원",
    "50만원",
    "100만원",
    "직접입력",
  ];
  const [amount, setAmount] = useState<number>(0);
  const [selected, setSelected] = useState<string>("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // ESC 키로 닫기
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  const handleAmount = (money: string) => {
    setSelected(money);
    setIsEditing(false);
    switch (money) {
      case "5천원":
        setAmount(5000);
        break;
      case "1만원":
        setAmount(10000);
        break;
      case "3만원":
        setAmount(30000);
        break;
      case "5만원":
        setAmount(50000);
        break;
      case "10만원":
        setAmount(100000);
        break;
      case "50만원":
        setAmount(500000);
        break;
      case "100만원":
        setAmount(1000000);
        break;
      case "직접입력":
        setIsEditing(true);
        setAmount(0);
        inputRef.current?.focus();
        break;
      default:
        break;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 후원하기 로직추가
    onClose();
  };

  if (typeof window === "undefined") return null;

  return createPortal(
    <div
      className="fixed top-0 left-0 w-full h-full bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="flex-center flex-col max-w-lg w-1/2 h-fit bg-white rounded-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h1 className="w-full py-4 border-b-2 border-b-mainred text-center text-lg font-semibold">
          후원하기
        </h1>
        <div className="w-full flex gap-5 p-10 border-b-2 border-b-gray-300 ">
          <div className="relative w-30 min-h-25 my-auto bg-gray-200">
            <Image
              src="https://gongu.copyright.or.kr/gongu/wrt/cmmn/wrtFileImageView.do?wrtSn=13002262&filePath=L2Rpc2sxL25ld2RhdGEvMjAxNi8yMS9DTFM2Lzc4MzA1MWJmLWYxZGMtNGFmMS05YTcxLWYzMmFkNTZmYjMyYQ==&thumbAt=Y&thumbSe=b_tbumb&wrtTy=10006"
              alt="후원이미지"
              fill
              className="object-contain"
              priority
            />
          </div>

          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="text-sm text-gray-500">{organization}</p>
          </div>
        </div>
        <form
          className="flex flex-col gap-5 px-10 py-5 w-full"
          onSubmit={handleSubmit}
        >
          <div className="flex justify-between">
            <label className="text-lg font-semibold" htmlFor="amount">
              후원금액
            </label>
            <div className="flex-center gap-1 border-b-2 border-mainred">
              <input
                ref={inputRef}
                id="amount"
                name="amount"
                type="numeric"
                className="max-w-30 text-right font-medium focus:outline-none"
                value={isEditing ? amount || "" : `${formatMoney(amount)}`}
                onFocus={() => setIsEditing(true)}
                onBlur={() => setIsEditing(false)}
                onChange={(e) => {
                  const numberAmount = e.target.value.replace(/[^\d]/g, "");
                  setAmount(Number(numberAmount));
                }}
              />
              <span className="font-medium">원</span>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4 pb-4">
            {moneyList.map((money, i) => (
              <Button
                key={i}
                className={`rounded-xl w-full ${
                  selected === money
                    ? "bg-mainred text-white hover:bg-mainred"
                    : "hover:bg-pastelred"
                } font-medium`}
                color="gray"
                size="sm"
                onClick={() => handleAmount(money)}
              >
                {money}
              </Button>
            ))}
          </div>
          <Button type="submit" className="w-60 m-auto" color="red">
            후원하기
          </Button>
        </form>
      </div>
    </div>,
    document.body
  );
}

export default DonateModal;
