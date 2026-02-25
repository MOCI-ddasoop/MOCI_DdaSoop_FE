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
import { ko } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useCreateTogether } from "../api/useCreateTogether";
import { useAuthStore } from "@/store/authStore";
import { categoryType } from "@/shared/constants/filter";
import { Alert } from "@/shared/utils/alert";

const TOGETHER_CATEGORIES = [
  { id: 1, label: "플로깅", key: "PLOGGING" },
  { id: 2, label: "봉사활동", key: "CLEANUP" },
  { id: 3, label: "친환경습관", key: "RECYCLING" },
  { id: 4, label: "기타", key: "ETC" },
];
type OnlineType = "ONLINE" | "OFFLINE";

function TogetherCreateForm() {
  const router = useRouter();

  const { mutate: handleCreateTogether } = useCreateTogether();

  const userId = useAuthStore((s) => s.me?.memberId);

  const [togetherName, setTogetherName] = useState("");
  const [onlineType, setOnlineType] = useState<OnlineType | null>(null);
  const [maxParticipants, setMaxParticipants] = useState<number | undefined>(
    undefined,
  );
  const [category, setCategory] = useState<string | null>(null);
  const [targetFeed, setTargetFeed] = useState<number | "">("");
  const [periodId, setPeriodId] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [togetherInfo, setTogetherInfo] = useState<string | undefined>(
    undefined,
  );
  const [images, setImages] = useState<File[]>([]);
  const textBoxRef = useRef<TextBoxHandle>(null);
  const isFormFilled =
    togetherName.trim() !== "" &&
    onlineType !== null &&
    category !== null &&
    targetFeed !== "" &&
    startDate !== null &&
    endDate !== null &&
    endDate >= startDate &&
    togetherInfo &&
    togetherInfo.trim() !== "";
  const today = new Date();
  const maxEndDate = startDate
    ? new Date(new Date(startDate).setFullYear(startDate.getFullYear() + 1))
    : undefined;

  //TODO: 모임 생성 API 연동 후 화면 렌더링 시 sanitizeHtml 적용 필요
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!textBoxRef.current) return;
    const html = textBoxRef.current.getHTML();
    if (html.trim() === "") {
      Alert({ text: "모임 소개글을 입력해주세요.", timer: 1500 });
      return;
    }
    handleCreateTogether({
      title: togetherName,
      description: togetherInfo,
      category: category! as "PLOGGING" | "CLEANUP" | "RECYCLING" | "ETC",
      mode: onlineType!,
      capacity: maxParticipants,
      startDate: startDate!.toISOString().slice(0, 10),
      endDate: endDate!.toISOString().slice(0, 10),
      memberId: userId,
    });
    Alert({ text: "함께하기 생성이 완료되었습니다!", timer: 1500 });
    router.push("/together");
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
      {/* 모임 이름 */}
      <div className="mb-4">
        <div className="flex items-center p-2 gap-3">
          <label htmlFor="togetherName" className="text-xl font-bold">
            모임 이름
          </label>
          <span className="text-mainred text-sm ml-3">
            *필수 입력 항목입니다
          </span>
        </div>
        <input
          type="text"
          className="border border-gray-300 rounded-lg p-2 h-10 w-[300px] outline-none focus:outline-none focus:ring-2 focus:ring-mainblue"
          placeholder="모임이름을 입력해주세요"
          value={togetherName}
          onChange={(e) => setTogetherName(e.target.value)}
        />
      </div>
      {/* 온라인 / 오프라인 */}
      <div className="mb-4">
        <div className="flex items-center p-2 gap-3">
          <h3 className="text-xl font-bold">온라인/오프라인 선택</h3>
          <span className="text-mainred text-sm ml-3">
            *필수 선택 항목입니다
          </span>
        </div>
        <div className="flex gap-2.5 mb-3">
          <Capsule
            type="isOnline"
            text="온라인"
            selected={onlineType === "ONLINE"}
            onClick={() => setOnlineType("ONLINE")}
          />
          <Capsule
            type="isOnline"
            text="오프라인"
            selected={onlineType === "OFFLINE"}
            onClick={() => setOnlineType("OFFLINE")}
          />
        </div>
        <div className="flex items-center">
          <label className="font-medium">제한 인원(선택)</label>
          <input
            type="text"
            className="border border-gray-300 rounded-lg p-1 h-8 w-15 mx-3 text-right outline-none focus:outline-none focus:ring-2 focus:ring-mainblue"
            value={maxParticipants ?? ""}
            onChange={(e) => {
              const value = e.target.value;
              if (!/^\d*$/.test(value)) return;
              setMaxParticipants(value === "" ? undefined : Number(value));
            }}
          />
          <span>명</span>
        </div>
      </div>
      {/* 카테고리 선택*/}
      <div className="mb-4">
        <div className="flex items-center p-2 gap-3">
          <h3 className="text-xl font-bold">카테고리 선택</h3>
          <span className="text-mainred text-sm ml-3">
            *필수 선택 항목입니다
          </span>
        </div>
        <div className="flex gap-2.5">
          {TOGETHER_CATEGORIES.map((c) => (
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
      {/* 함께하기 목표 / 기간 */}
      <div className="mb-5">
        <div className="flex items-center p-2 gap-3">
          <label className="text-xl font-bold">함께하기 목표 / 기간</label>
          <span className="text-mainred text-sm ml-3">
            *필수 입력 항목입니다
          </span>
        </div>
        <div className="flex items-center mb-4">
          <label htmlFor="targetFeed" className="font-medium">
            목표 피드 개수
          </label>
          <input
            type="text"
            className="border border-gray-300 rounded-lg p-1 h-8 w-15 mx-3 text-right outline-none focus:outline-none focus:ring-2 focus:ring-mainblue"
            value={targetFeed}
            onChange={(e) => {
              const value = e.target.value;
              if (!/^\d*$/.test(value)) return;
              setTargetFeed(value === "" ? "" : Number(value));
            }}
          />
          <span>개</span>
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
      {/* 모임 소개글 영역 */}
      <div className="mb-4">
        <div className="flex items-center p-2 gap-3 mb-3">
          <label className="text-xl font-bold">모임 소개글</label>
          <span className="text-mainblue text-sm ml-3">
            * 사진은 최대 5장까지 추가할 수 있습니다
          </span>
        </div>
        <TextBox
          ref={textBoxRef}
          className="border border-gray-300 rounded-lg p-2 w-full h-25 outline-none focus:outline-none focus:ring-2 focus:ring-mainblue resize-none mb-3"
          placeholder="모임 소개글을 입력해주세요"
          setValue={setTogetherInfo}
        />
        <FormImageInput images={images} onChangeImages={setImages} />
      </div>
      <Button
        type="submit"
        fullWidth
        className="font-medium"
        disabled={!isFormFilled}
      >
        작성완료
      </Button>
    </form>
  );
}
export default TogetherCreateForm;
