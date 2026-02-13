import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Button from "@/shared/components/Button";
import { formatMoney } from "../utils/formatMoney";
import {
  loadTossPayments,
  TossPaymentsWidgets,
} from "@tosspayments/tosspayments-sdk";
import { generateOrderId, getCustomerKey } from "../utils/getKeys";
import { useAuthStore } from "@/store/authStore";
import { useParams, useRouter } from "next/navigation";
import { usePostPayment } from "../api/usePostPayment";

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
  const [step, setStep] = useState<"amount" | "payment">("amount");
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
  const [amount, setAmount] = useState<number>(0);
  const [selected, setSelected] = useState<string>("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [ready, setReady] = useState(false);
  const [widgets, setWidgets] = useState<TossPaymentsWidgets | null>(null);

  const router = useRouter();

  const me = useAuthStore((s) => s.me);
  const memberId = me?.memberId;
  const name = me?.name;
  const TOSS_CLIENT_KEY = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;
  const { mutateAsync: postPayment } = usePostPayment();

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

  useEffect(() => {
    async function fetchPaymentWidget() {
      if (!TOSS_CLIENT_KEY) return;
      if (!memberId) return;
      const tossPayments = await loadTossPayments(TOSS_CLIENT_KEY);
      const customerKey = getCustomerKey({ memberId });
      const widgets = tossPayments.widgets({ customerKey });

      setWidgets(widgets);
    }
    fetchPaymentWidget();
  }, [TOSS_CLIENT_KEY, memberId]);

  useEffect(() => {
    async function renderPaymentWidgets() {
      if (widgets === null) return;
      if (step !== "payment") return;
      await widgets.setAmount({
        currency: "KRW",
        value: amount,
      });
      await Promise.all([
        // ------  결제 UI 렌더링 ------
        widgets.renderPaymentMethods({
          selector: "#payment-method",
          variantKey: "DEFAULT",
        }),
        widgets.renderAgreement({
          selector: "#agreement",
          variantKey: "AGREEMENT",
        }),
      ]);

      setReady(true);
    }

    renderPaymentWidgets();
  }, [amount, step, widgets]);

  if (!memberId) return;

  const handlePayment = async () => {
    if (!widgets) return;
    try {
      // ------ '결제하기' 버튼 누르면 결제창 띄우기 ------
      // 결제를 요청하기 전에 orderId, amount를 서버에 저장하세요.
      // 결제 과정에서 악의적으로 결제 금액이 바뀌는 것을 확인하는 용도입니다.
      const { paymentKey, orderId, amount } = await widgets.requestPayment({
        orderId: generateOrderId(),
        orderName: `따숲 후원하기 : ${title}`,
        customerName: name,
      });
      await postPayment({
        donationId: String(id),
        paymentKey,
        orderId,
        amount: amount.value,
        memberId,
      });

      alert(
        `결제에 성공했습니다\n결제번호 : ${orderId}\n결제금액 : ${amount.value}원`,
      );
      router.replace(`/donate/${id}/info`);
      onClose();
    } catch (error) {
      alert(`결제 처리 중 오류가 발생했습니다`);
    }
  };

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

    setReady(false);
    setStep("payment");
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
        <div
          className={`w-full flex gap-5 ${step === "amount" ? "p-10" : "px-10 py-5"} border-b-2 border-b-gray-300 `}
        >
          <div
            className={`${step === "amount" ? "w-30 min-h-20" : "w-20 min-h-15"} relative my-auto bg-gray-200`}
          >
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
          {step === "payment" && (
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
        {step === "payment" && (
          <div className="flex flex-col gap-2 px-10 py-5 w-full">
            <div id="payment-method" className="max-h-70 overflow-y-auto" />
            <div id="agreement" />
            <Button
              className="w-60 m-auto"
              color="red"
              onClick={handlePayment}
              disabled={!ready}
            >
              {ready ? "결제하기" : "로딩중"}
            </Button>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}

export default DonateModal;
