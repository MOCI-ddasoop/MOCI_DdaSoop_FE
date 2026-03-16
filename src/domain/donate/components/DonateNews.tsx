"use client";
import Button from "@/shared/components/Button";
import { useRef, useState } from "react";
import { usePostNews } from "../api/usePostNews";
import { useGetNews } from "../api/useGetNews";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/config/queryKeys";
import TextBox, { TextBoxHandle } from "@/shared/components/TextBox";
import { sanitizeHtml } from "@/shared/utils/sanitizeHtml";
import { useAuthStore } from "@/store/authStore";
import { useGetIsCreator } from "../api/useGetIsCreator";
import { Alert } from "@/shared/utils/alert";

function DonateNews({ id }: { id: string }) {
  const userId = useAuthStore((s) => s.me?.memberId);
  const {
    data: isCreator,
    isPending,
    isError,
  } = useGetIsCreator({ id, memberId: userId ?? -1 });
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef<TextBoxHandle | null>(null);
  const { mutateAsync: postDonationNews } = usePostNews(id);
  const { data, isPending: pendingNews, isError: newsError } = useGetNews(id);
  const queryClient = useQueryClient();

  const handleSubmit = async () => {
    if (!textareaRef.current) return;
    if (textareaRef.current.getHTML().trim() === "") {
      Alert({ text: "소식을 입력해주세요", timer: 1500, red: true });
      return;
    }
    await postDonationNews(textareaRef.current.getHTML());
    queryClient.refetchQueries({ queryKey: queryKeys.donate.news(id) });
    setIsEditing(false);
  };

  return (
    <div className="w-full flex flex-col items-center gap-4">
      {pendingNews || isPending ? (
        <div className="w-full h-28 flex-center">
          <div className="loader loader-red"></div>
        </div>
      ) : newsError || isError ? (
        <p className="w-full text-gray-500">오류가 발생했습니다</p>
      ) : (
        <div className="w-full">
          <p
            className={data.data.id ? "" : "text-gray-500 text-center"}
            dangerouslySetInnerHTML={{
              __html: data.data.id
                ? sanitizeHtml(data.data.description ?? "")
                : "작성된 소식이 없습니다",
            }}
          ></p>
          <p className="w-full text-sm text-gray-500">{data.data.title}</p>
        </div>
      )}
      {!pendingNews &&
        !isPending &&
        isCreator?.data &&
        !isEditing &&
        !data?.data.description && (
          <Button
            color="red"
            className="w-60"
            onClick={() => setIsEditing(true)}
            disabled={pendingNews}
          >
            작성하기
          </Button>
        )}
      {isEditing && (
        <>
          <div className="w-full">
            <TextBox
              ref={textareaRef}
              className="w-full resize-none border border-gray-300 rounded-lg px-4 py-2 overflow-hidden focus:outline-pastelred min-h-15 max-h-106"
              placeholder={"후원 관련 소식과 후원금 사용 내역을 작성해주세요"}
            ></TextBox>
          </div>
          <Button className="w-60" color="red" onClick={handleSubmit}>
            작성하기
          </Button>
        </>
      )}
    </div>
  );
}

export default DonateNews;
