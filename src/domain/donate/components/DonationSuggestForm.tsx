"use client";
import FormImageInput from "@/domain/form/FormImageInput";
import Button from "@/shared/components/Button";
import Capsule from "@/shared/components/Capsule";
import TextBox, { TextBoxHandle } from "@/shared/components/TextBox";
import {
  PERIOD_OPTIONS,
  CUSTOM_PERIOD_ID,
} from "@/shared/config/periodOptions";
import { calcPeriod } from "@/shared/utils/calcPeriod";
import { useAuthStore } from "@/store/authStore";
import { ko } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useCreateDonate } from "../api/useCreateDonte";
import { usePostImage } from "@/shared/api/usePostImage";
import { Alert } from "@/shared/utils/alert";

const DONATION_CATEGORIES = [
  //TODO: 카테고리 데이터 API 연동
  { id: 1, label: "동물", key: "ANIMAL" },
  { id: 2, label: "환경", key: "ENVIRONMENT" },
  { id: 3, label: "사회", key: "SOCIETY" },
  { id: 4, label: "기타", key: "ETC" },
];

function DonationSuggestForm() {
  const router = useRouter();

  const userId = useAuthStore((s) => s.me?.memberId);

  const { mutateAsync: handleCreateDonate } = useCreateDonate();
  const { mutateAsync: postImages } = usePostImage();

  const [donationName, setDonationName] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [targetAmount, setTargetAmount] = useState<number | "">("");
  const [periodId, setPeriodId] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [donationInfo, setDonationInfo] = useState<string>("");
  const [images, setImages] = useState<File[]>([]);
  const textBoxRef = useRef<TextBoxHandle>(null);
  const isFormFilled =
    donationName.trim() !== "" &&
    category !== null &&
    typeof targetAmount === "number" &&
    targetAmount > 0 &&
    startDate !== null &&
    endDate !== null &&
    endDate >= startDate &&
    donationInfo.trim() !== "";
  const today = new Date();

  const maxEndDate = startDate
    ? new Date(new Date(startDate).setFullYear(startDate.getFullYear() + 1))
    : undefined;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (value === "") {
      setTargetAmount("");
    } else {
      setTargetAmount(Number(value));
    }
  };
  // TODO: 후원 제안 API 연동 후 화면 렌더링 시 sanitizeHtml 적용 필요
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!textBoxRef.current) return;
    const html = textBoxRef.current.getHTML();
    if (html.trim() === "") {
      Alert({ text: "후원 소개글을 입력해주세요.", red: true });
      return;
    }
    try {
      let imageUrls;
      if (images.length !== 0) {
        const imageUpload = await postImages(images, {
          onError: (error) => {
            throw new Error("이미지 업로드 실패");
          },
        });
        imageUrls = imageUpload.map((img) => img.imageUrl!);
      }
      await handleCreateDonate({
        title: donationName,
        description: donationInfo,
        category: category! as "ANIMAL" | "ENVIRONMENT" | "SOCIETY" | "ETC",
        startDate: startDate!.toISOString().slice(0, 10),
        endDate: endDate!.toISOString().slice(0, 10),
        goalAmount: targetAmount as number,
        memberId: userId,
        imageUrls,
      });
      await Alert({
        text: "후원 제안이 완료되었습니다!",
        timer: 1500,
        red: false,
      });
      router.push("/donate");
    } catch (e) {
      Alert({ text: "후원 제안에 실패하였습니다", red: true });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-[1000px] flex flex-col p-4"
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
        }
      }}
    >
      {/*후원 이름 입력 */}
      <div className="mb-8">
        <div className="flex items-center p-2 gap-3">
          <label htmlFor="donationName" className="text-xl font-bold">
            후원 이름
          </label>
          <span className="text-mainred text-sm ml-3">
            *필수 입력 항목입니다
          </span>
        </div>
        <input
          type="text"
          className="border border-gray-300 rounded-lg p-2 h-10 w-[300px] outline-none focus:outline-none focus:ring-2 focus:ring-mainblue"
          placeholder="후원이름을 입력해주세요"
          value={donationName}
          onChange={(e) => setDonationName(e.target.value)}
        />
      </div>
      {/*카테고리 선택 */}
      <div className="mb-8">
        <div className="flex items-center p-2 gap-3">
          <h3 className="text-xl font-bold">카테고리 선택</h3>
          <span className="text-mainred text-sm ml-3">
            *필수 선택 항목입니다
          </span>
        </div>
        <div className="flex gap-2.5">
          {DONATION_CATEGORIES.map((c) => (
            <Capsule
              key={c.id}
              type="category"
              text={c.label}
              selected={category === c.key}
              onClick={() => setCategory(c.key)}
            />
          ))}
        </div>
      </div>
      {/* 후원 목표 / 기간 입력 */}
      <div className="mb-8">
        <div className="flex items-center p-2 gap-3">
          <label className="text-xl font-bold">후원 목표 / 기간</label>
          <span className="text-mainred text-sm ml-3">
            *필수 입력 항목입니다
          </span>
        </div>

        {/* 목표 금액 영역 */}
        <div className="flex items-center mb-4">
          <label htmlFor="targetAmount" className="font-medium">
            목표 금액
          </label>
          <input
            id="targetAmount"
            type="text"
            className="border border-gray-300 rounded-lg p-2 h-10 w-44 mx-3 outline-none focus:ring-2 focus:ring-mainblue text-right"
            value={targetAmount !== "" ? targetAmount.toLocaleString() : ""}
            onChange={handleAmountChange}
          />
          <span className="font-medium">원</span>
        </div>

        {/* 기간 선택 영역 */}
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <label className="font-medium mt-1 w-8">기간</label>
            <div className="flex flex-wrap gap-2.5 flex-1">
              {PERIOD_OPTIONS.map((option) => (
                <Capsule
                  key={option.id}
                  type="date"
                  text={option.label}
                  selected={periodId === option.id}
                  onClick={() => {
                    setPeriodId(option.id);
                    const { startDate, endDate } = calcPeriod(option);
                    setStartDate(startDate);
                    setEndDate(endDate);
                  }}
                />
              ))}
              <Capsule
                type="date"
                text="직접입력"
                selected={periodId === CUSTOM_PERIOD_ID}
                onClick={() => {
                  setPeriodId(CUSTOM_PERIOD_ID);
                  setStartDate(null);
                  setEndDate(null);
                }}
              />
            </div>
          </div>
          {(periodId || startDate) && (
            <div className="pl-[44px] flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => {
                    setStartDate(date);
                    setEndDate(null);
                  }}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  minDate={today}
                  maxDate={maxEndDate}
                  locale={ko}
                  dateFormat="yyyy년 MM월 dd일"
                  disabled={periodId !== CUSTOM_PERIOD_ID}
                  className="border border-gray-300 rounded-md p-2 h-10 w-44 outline-none focus:ring-2 focus:ring-mainblue"
                />
                <span className="text-gray-500">-</span>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate ?? today}
                  maxDate={maxEndDate}
                  locale={ko}
                  dateFormat="yyyy년 MM월 dd일"
                  disabled={periodId !== CUSTOM_PERIOD_ID}
                  className="border border-gray-300 rounded-lg p-2 h-10 w-44 outline-none focus:ring-2 focus:ring-mainblue"
                />
                {periodId === CUSTOM_PERIOD_ID && (
                  <p className="text-sm text-mainblue ml-2">
                    * 기간은 최대 1년까지 설정할 수 있습니다
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      {/*후원 소개글 영역*/}
      <div className="mb-8">
        <div className="flex items-center p-2 gap-3">
          <label className="text-xl font-bold">후원 소개글</label>
          <span className="text-mainblue text-sm ml-3">
            * 사진은 최대 5장까지 추가할 수 있습니다
          </span>
        </div>
        <TextBox
          ref={textBoxRef}
          className="border border-gray-300 rounded-lg p-2 w-full h-25 outline-none focus:outline-none focus:ring-2 focus:ring-mainblue resize-none mb-3"
          placeholder="후원 소개글을 입력해주세요"
          setValue={setDonationInfo}
        />
        <FormImageInput images={images} onChangeImages={setImages} />
      </div>

      <div>
        <Button
          type="submit"
          fullWidth
          className="font-medium"
          disabled={!isFormFilled}
        >
          작성완료
        </Button>
      </div>
    </form>
  );
}
export default DonationSuggestForm;
