"use client";
import Button from "@/shared/components/Button";
import { useRef, useState } from "react";
import { usePostNews } from "../api/usePostNews";
import { useGetNews } from "../api/useGetNews";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/config/queryKeys";
import TextBox, { TextBoxHandle } from "@/shared/components/TextBox";

function DonateNews({ id }: { id: string }) {
  const isCreator = true;
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef<TextBoxHandle | null>(null);
  const { mutateAsync: postDonationNews } = usePostNews(id);
  const { data, isPending, isError } = useGetNews(id);
  const queryClient = useQueryClient();

  const handleSubmit = async () => {
    if (!textareaRef.current) return;
    if (textareaRef.current.getHTML().trim() === "") {
      alert("소식을 입력해주세요");
    }
    await postDonationNews(textareaRef.current.getHTML());
    queryClient.refetchQueries({ queryKey: queryKeys.donate.news(id) });
    setIsEditing(false);
  };

  return (
    <div className="w-full flex flex-col items-center gap-4">
      {isPending ? (
        <div className="w-full h-28 flex-center">
          <div className="loader"></div>
        </div>
      ) : isError ? (
        <p className="w-full text-gray-500">오류가 발생했습니다</p>
      ) : (
        <div className="w-full">
          <p
            dangerouslySetInnerHTML={{ __html: data?.data.description ?? "" }}
          ></p>
          <p className="w-full text-sm text-gray-500">{data.data.title}</p>
        </div>
      )}
      {isCreator && !isEditing && !data && (
        <Button
          color="red"
          className="w-60"
          onClick={() => setIsEditing(true)}
          disabled={isPending}
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
