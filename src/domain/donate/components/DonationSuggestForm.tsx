"use client"
import FormImageInput from "@/domain/form/FormImageInput";
import Button from "@/shared/components/Button";
import Capsule from "@/shared/components/Capsule";
import { PERIOD_OPTIONS, CUSTOM_PERIOD_ID } from "@/shared/config/periodOptions";
import { calcPeriod } from "@/shared/utils/calcPeriod";
import { ko } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DONATION_CATEGORIES = [ //TODO: 카테고리 데이터 API 연동 
  { id: 1, label: "사회" },
  { id: 2, label: "환경" },
  { id: 3, label: "동물" },
  { id: 4, label: "기타" },
];

function DonationSuggestForm() {
  const [donationname, setDonationname] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [targetAmount, setTargetAmount] = useState<number | "">("");
  const [periodId, setPeriodId] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [donationInfo, setDonationInfo] = useState<string>("");
  const [images, setImages] = useState<File[]>([]);
  const router = useRouter();
  const isFormFilled = donationname.trim() !== "" && categoryId !== null && typeof targetAmount === "number" &&
  targetAmount > 0 && startDate !== null && endDate !== null && endDate >= startDate;

  const today = new Date();

  const maxEndDate =
    startDate
      ? new Date(
          new Date(startDate).setFullYear(startDate.getFullYear() + 1)
        )
      : undefined;
// TODO: API 연동
   const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    alert("후원 제안이 완료되었습니다!");
    router.push("/donate");
  }   

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); 
    if(value === ""){
      setTargetAmount("");
    } else {
      setTargetAmount(Number(value));
    }
  }
  return (
    <form onSubmit={handleSubmit} className="max-w-[1000px] flex flex-col p-4">
      {/*후원 이름 입력 */}
      <div className="mb-8">
        <div className="flex items-center p-2 gap-3">
          <label htmlFor="donationName" className="text-xl font-bold">후원 이름</label>
          <span className="text-mainred text-sm ml-3">*필수 입력 항목입니다</span>
        </div>
        <input 
          type="text"
          className="border border-gray-300 rounded-lg p-2 h-10 w-[300px] outline-none focus:outline-none focus:ring-2 focus:ring-mainblue"
          placeholder="후원이름을 입력해주세요"
          value={donationname}
          onChange={(e) => setDonationname(e.target.value)}
        />
      </div>
      {/*카테고리 선택 */}
      <div className="mb-8">
        <div className="flex items-center p-2 gap-3">
            <h3 className="text-xl font-bold">카테고리 선택</h3>
            <span className="text-mainred text-sm ml-3">*필수 선택 항목입니다</span>
        </div>
        <div className="flex gap-2.5">
          {DONATION_CATEGORIES.map((category) => (
            <Capsule 
              key={category.id} 
              type="category"  
              text={category.label} 
              selected = {categoryId === category.id}
              onClick={() => setCategoryId(category.id)}
            />
          ))}
        </div>
      </div>
      {/* 후원 목표 / 기간 입력 */}
      <div className="mb-8">
        <div className="flex items-center p-2 gap-3">
          <label className="text-xl font-bold">후원 목표 / 기간</label>
          <span className="text-mainred text-sm ml-3">*필수 입력 항목입니다</span>
        </div>

        {/* 목표 금액 영역 */}
        <div className="flex items-center mb-4">
          <label htmlFor="targetAmount" className="font-medium">목표 금액</label>
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
          <div className="pl-[44px] flex flex-col gap-2"> 
            <div className="flex items-center gap-2">
              <DatePicker
                selected={startDate}
                onChange={(date) => {
                  setStartDate(date);
                  setEndDate(null);
                  setPeriodId(CUSTOM_PERIOD_ID);
                }}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                minDate={today}
                maxDate={maxEndDate}
                locale={ko}
                dateFormat="yyyy년 MM월 dd일"
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
                className="border border-gray-300 rounded-lg p-2 h-10 w-44 outline-none focus:ring-2 focus:ring-mainblue"
              />
              <p className="text-sm text-mainblue ml-2">
                * 기간은 최대 1년까지 설정할 수 있습니다
              </p>
            </div>
          </div>
        </div>
      </div>
      {/*후원 소개글 영역*/}
      <div className="mb-8">
        <div className="flex items-center p-2 gap-3">
          <label className="text-xl font-bold">후원 소개글</label>
          <span className="text-mainblue text-sm ml-3">* 사진은 최대 5장까지 추가할 수 있습니다</span>
        </div>
        <textarea
          className="border border-gray-300 rounded-lg p-2 w-full h-25 outline-none focus:outline-none focus:ring-2 focus:ring-mainblue resize-none mb-3"
          placeholder="후원 소개글을 입력해주세요"
          value={donationInfo}
          onChange={(e) => setDonationInfo(e.target.value)}
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
  )
}
export default DonationSuggestForm;