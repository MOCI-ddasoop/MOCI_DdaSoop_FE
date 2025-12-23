"use client";
import FeedImageInput, { FeedImage } from "./FeedImageInput";
import { useEffect, useMemo, useState } from "react";
import TogetherListItem from "./TogetherListItem";
import TextBox from "./TextBox";
import Button from "./Button";
import TagInput from "./TagInput";

//---------------추후 삭제 필요--------------
export interface FeedOptionData {
  together: Together;
  user: {
    role: string;
    IsCheckedIn: boolean;
  };
}

type FeedForm = Omit<
  Feed,
  "id" | "date" | "likeCount" | "commentCount" | "likedByMe"
>;

function FeedCreatorModal({
  initialTogetherInfo,
  onClose,
  isOpen,
  userTogetherList,
}: {
  initialTogetherInfo?: FeedOptionData;
  onClose: () => void;
  isOpen: boolean;
  userTogetherList?: FeedOptionData[];
}) {
  const [feedImageList, setFeedImageList] = useState<FeedImage[]>([]);
  const [selectedTogether, setSelectedTogether] = useState<string>("main");
  const [textBoxValue, setTextBoxValue] = useState<string>();
  const [togetherInfo, setTogetherInfo] = useState<FeedOptionData | undefined>(
    initialTogetherInfo
  );
  const [selectedPostVisibility, setSelectedPostVisibility] = useState<
    string | null
  >("public");

  useEffect(() => {
    if (!isOpen) return;

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
  }, [isOpen]);

  const handleFeedFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPostVisibility) return;
    const feedFormData: FeedForm = {
      author: "애착침대",
      content: textBoxValue ?? "",
      tags: [],
      image: feedImageList,
      togetherId: togetherInfo?.together.id,
      postVisibility: selectedPostVisibility,
    };
    console.log(feedFormData);
    onClose();
  };

  const handleTogetherSelectionChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = e.target.value;
    setSelectedTogether(value);
    const selected = userTogetherList?.find(
      (i) => i.together.id.toString() === value
    );
    setTogetherInfo(selected ?? undefined);

    let checkedPostVisibility = document.querySelector(
      'input[name="postVisibility"]:checked'
    );
    if (!checkedPostVisibility) setSelectedPostVisibility(null);
    checkedPostVisibility = null;
  };

  const handleTogetherItemClick = (e: React.MouseEvent) => {
    e.preventDefault();

    window.open(togetherInfo?.together.href, "noopener,noreferrer");
  };

  // 함께하기 선택 옵션
  const selectTogetherOption = initialTogetherInfo ? (
    <option defaultValue={initialTogetherInfo.together.id}>
      {initialTogetherInfo.together.name.length > 7
        ? initialTogetherInfo.together.name.slice(0, 7) + "…"
        : initialTogetherInfo.together.name}
    </option>
  ) : (
    <>
      <option value="main" defaultValue={"main"}>
        개인 피드
      </option>
      {userTogetherList?.map(({ together: { id, name } }) => (
        <option key={id} value={id}>
          {name.length > 7 ? name.slice(0, 7) + "…" : name}
        </option>
      ))}
    </>
  );

  // TextBox 입력 가능 여부
  const isTextBoxEditable = useMemo(() => {
    if (togetherInfo?.user.IsCheckedIn && selectedPostVisibility !== "notice") {
      return false;
    }
    return true;
  }, [togetherInfo, selectedPostVisibility]);

  // 함께하기 item: api로 불러올수도있으니 useMemo 사용
  const togetherItem = useMemo(
    () =>
      togetherInfo ? (
        <TogetherListItem
          id={togetherInfo.together.id}
          image={togetherInfo.together.image}
          name={togetherInfo.together.name}
          category={togetherInfo.together.category}
          isOnline={togetherInfo.together.isOnline}
          href={togetherInfo.together.href}
          widthClass="w-full"
        />
      ) : (
        ""
      ),
    [togetherInfo]
  );

  // 공개여부
  const postVisibilityOptions = useMemo(() => {
    const options = [
      { value: "public", label: "공개" },
      { value: "private", label: "비공개" },
      { value: "memberOnly", label: "멤버에게만 공개" },
      { value: "notice", label: "공지" },
    ];
    if (!togetherInfo) {
      return options.filter(
        ({ value }) => value === "public" || value === "private"
      );
    } else if (togetherInfo && togetherInfo.user.role === "member") {
      return options.filter(
        ({ value }) => value === "public" || value === "memberOnly"
      );
    } else {
      return options.filter(
        ({ value }) =>
          value === "public" || value === "memberOnly" || value === "notice"
      );
    }
  }, [togetherInfo]);

  // 게시 버튼 disable 조건
  const disableSubmitButton = useMemo(() => {
    // 1) 이미 인증한 함께하기일 경우
    if (togetherInfo?.user.IsCheckedIn) {
      const isLeader = togetherInfo.user.role === "leader";
      const isNotice = selectedPostVisibility === "notice";
      // 리더이면서 notice만 가능
      if (isLeader && isNotice) return false;

      // 그 외는 전부 불가능
      return true;
    }
    // 2) 공개 여부가 선택되지 않으면 불가능
    if (!selectedPostVisibility) return true;

    // 3) 이미지 또는 텍스트 중 하나라도 있으면 가능
    const hasContent = feedImageList.length > 0 || !!textBoxValue;
    if (!hasContent) return true;

    // 4) 그 외는 가능
    return false;
  }, [selectedPostVisibility, togetherInfo, feedImageList, textBoxValue]);

  if (typeof window === "undefined") return null;
  return (
    isOpen && (
      <div
        className="fixed top-0 left-0 w-full h-full bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm"
        onClick={onClose}
      >
        <div
          className="flex w-full h-[90vh] max-w-4xl max-h-4xl bg-white rounded-md box-border"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ---------이미지영역 */}
          <div className="w-3/5 h-full flex flex-col bg-black/30">
            <FeedImageInput
              slideList={feedImageList}
              setSlideList={setFeedImageList}
            />
          </div>
          {/* --------콘텐츠영역 */}
          <div className="flex flex-col w-2/5 h-full px-3">
            {/* 함께하기 선택 */}
            <div className="py-4 flex justify-start items-end  border-b border-b-pastelblue gap-2">
              <select
                name="together"
                id="together"
                value={selectedTogether}
                onChange={handleTogetherSelectionChange}
                className="outline-none"
              >
                {selectTogetherOption}
              </select>
              {initialTogetherInfo ? (
                ""
              ) : (
                <label htmlFor="together" className={`text-sm	text-gray-400`}>
                  *인증 할 함께하기를 선택해주세요.
                </label>
              )}
            </div>
            {/* 스크롤zone */}
            <div className="flex flex-col flex-1 overflow-y-auto">
              {/* 텍스트박스 */}

              <TextBox
                isAble={isTextBoxEditable}
                hidden={!isTextBoxEditable}
                className={`flex-1 min-h-fit px-2 mt-3 overflow-visible`}
                placeholder={
                  selectedPostVisibility === "notice"
                    ? "공지글을 입력해주세요."
                    : "글을 입력해주세요."
                }
                setValue={setTextBoxValue}
              />
              {!isTextBoxEditable && (
                <div className="flex-1 px-2 mt-3 text-mainred">
                  이미 인증을 완료한 함께하기 입니다.
                </div>
              )}
              {/* 함께하기 바로가기 */}
              {togetherInfo ? (
                <div className="p-2" onClick={handleTogetherItemClick}>
                  {togetherItem}
                </div>
              ) : (
                ""
              )}
              {/* 태그 입력 */}
              <div className="mt-3">
                {["#태그", "#태그입력", "#수진님이 해주신데요"].map(
                  (i, index) => (
                    <span key={index} className="text-mainblue">
                      {i}
                    </span>
                  )
                )}
              </div>
            </div>
            {/* 공개/비공개 선택 */}
            <fieldset className="flex border-t border-t-pastelblue px-2 pt-2 gap-2 mt-3">
              {postVisibilityOptions.map(({ value, label }, index) => (
                <div key={index}>
                  <input
                    type="radio"
                    id={value}
                    name="postVisibility"
                    value={value}
                    onChange={(e) => setSelectedPostVisibility(e.target.value)}
                    checked={selectedPostVisibility === value}
                  />
                  <label htmlFor={value} className="p-1">
                    {label}
                  </label>
                </div>
              ))}
            </fieldset>

            <Button
              className="w-full my-3"
              disabled={disableSubmitButton}
              onClick={handleFeedFormSubmit}
            >
              게시하기
            </Button>
          </div>
        </div>
      </div>
    )
  );
}
export default FeedCreatorModal;
