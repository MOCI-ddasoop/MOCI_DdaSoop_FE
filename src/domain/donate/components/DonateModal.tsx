import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Button from "@/shared/components/Button";
import { formatMoney } from "../utils/formatMoney";
import {
  loadTossPayments,
  TossPaymentsSDK,
} from "@tosspayments/tosspayments-sdk";
import { generateOrderId, getCustomerKey } from "../utils/getKeys";
import { useAuthStore } from "@/store/authStore";
import { useParams } from "next/navigation";
import { FaRegCreditCard } from "react-icons/fa6";
import { MdLocalAtm, MdOutlineAtm } from "react-icons/md";

function DonateModal({
  onClose,
  title,
  organization,
  thumbnailImage,
}: {
  onClose: () => void;
  title: string;
  organization: string;
  thumbnailImage?: string;
}) {
  const [step, setStep] = useState<"amount" | "paymethod">("amount");
  const { id } = useParams();

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

  const paymentList = [
    {
      key: "CARD" as const,
      method: "카드",
      icon: <FaRegCreditCard size={28} />,
    },
    {
      key: "VIRTUAL_ACCOUNT" as const,
      method: "가상 계좌",
      icon: <MdLocalAtm size={28} />,
    },
    {
      key: "TRANSFER" as const,
      method: "계좌 이체",
      icon: <MdOutlineAtm size={28} />,
    },
  ];
  const [amount, setAmount] = useState<number>(0);
  const [selected, setSelected] = useState<string>("");
  const [selectedMethod, setSelectedMethod] = useState<
    "CARD" | "VIRTUAL_ACCOUNT" | "TRANSFER" | null
  >(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [tossPayments, setTossPayments] = useState<TossPaymentsSDK | null>(
    null,
  );

  const me = useAuthStore((s) => s.me);
  const memberId = me?.memberId;
  const name = me?.name;
  const TOSS_CLIENT_KEY = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;

  useEffect(() => {
    const tossSetting = async () => {
      if (!TOSS_CLIENT_KEY) return;
      const tossPayments = await loadTossPayments(TOSS_CLIENT_KEY);
      setTossPayments(tossPayments);
    };
    tossSetting();
  }, [TOSS_CLIENT_KEY]);

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

  if (!memberId) return;

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
    setStep("paymethod");
  };

  const handlePayment = async () => {
    if (!tossPayments) return;
    if (!selectedMethod) return;
    const payment = tossPayments.payment({
      customerKey: getCustomerKey({ memberId }),
    });
    const payOption = {
      amount: { currency: "KRW", value: amount },
      orderId: generateOrderId(),
      orderName: `따숲 후원하기 : ${title}`,
      customerName: name,
      successUrl: window.location.origin + `/donate/${id}/info`,
      failUrl: window.location.origin + `/donate/${id}/info`,
    };
    switch (selectedMethod) {
      case "CARD":
        return await payment.requestPayment({
          method: "CARD",
          ...payOption,
        });
      case "TRANSFER":
        return await payment.requestPayment({
          method: "TRANSFER",
          ...payOption,
        });
      case "VIRTUAL_ACCOUNT":
        return await payment.requestPayment({
          method: "VIRTUAL_ACCOUNT",
          ...payOption,
        });
    }
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
        <div className={`w-full flex gap-5 p-10 border-b-2 border-b-gray-300 `}>
          <div className={`w-30 min-h-20 relative my-auto bg-gray-200`}>
            <Image
              src={thumbnailImage ?? "/defaultFeedImage.png"}
              alt="후원이미지"
              fill
              className="object-contain"
              priority
            />
          </div>

          <div className="flex flex-col gap-1 flex-1">
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="text-sm text-gray-500">{organization}</p>
          </div>
          {step === "paymethod" && (
            <p className="font-medium text-mainred self-end">
              {formatMoney(amount)}
              <span className="text-black">원</span>
            </p>
          )}
        </div>
        {step === "amount" && (
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
                  onFocus={() => {
                    setIsEditing(true);
                    setSelected("직접입력");
                  }}
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
            <Button
              type="submit"
              className="w-60 m-auto"
              color="red"
              disabled={amount === 0}
            >
              후원하기
            </Button>
          </form>
        )}
        {step === "paymethod" && (
          <div className="flex flex-col gap-5 px-10 py-5 w-full">
            <div className="grid grid-cols-3 gap-4 py-4">
              {paymentList.map(({ key, method, icon }, i) => (
                <Button
                  key={i}
                  className={`rounded-xl w-full flex-center flex-col gap-1 ${
                    selectedMethod === key
                      ? "bg-mainred text-white hover:bg-mainred"
                      : "hover:bg-pastelred"
                  } font-medium`}
                  color="gray"
                  size="sm"
                  onClick={() => setSelectedMethod(key)}
                >
                  {icon}
                  <p className="w-full break-keep whitespace-normal">
                    {method}
                  </p>
                </Button>
              ))}
            </div>
            <div className="flex-center gap-5">
              <Button
                className="w-30 hover:bg-pastelred"
                color="gray"
                onClick={() => {
                  setStep("amount");
                  setSelectedMethod(null);
                }}
              >
                뒤로가기
              </Button>
              <Button
                className="w-30"
                color="red"
                onClick={handlePayment}
                disabled={!selectedMethod}
              >
                결제하기
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}

export default DonateModal;
