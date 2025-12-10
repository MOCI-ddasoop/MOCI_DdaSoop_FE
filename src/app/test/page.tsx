"use client";
import CardContainer from "@/domain/mypage/components/CardContainer";
import MyCommentContiner from "@/domain/mypage/components/MyCommentContiner";
import TagInput from "@/shared/components/TagInput";
import TextBox from "@/shared/components/TextBox";
import { useEffect, useState } from "react";

function TestPage() {
  const CARD_DATA = Array.from({ length: 20 }).map((_, index) => ({
    id: index,
    src: "https://i.namu.wiki/i/bjhl-c4YuugxXFaZaFRbPvU0IGuNuSPvqVoujzeccTdP39XErpUKxRO6HWPeNj9CWIMe_mEnEj5xfuZgB8BrNawRlD1X9gSxsHJsBSVf82G71Mdw4OROpopv0sa4SwRyDINrp08r3mD9WPCv1Xpsow.webp",
    alt: "test",
  }));

  const [tag, setTag] = useState<string[]>([]);

  const onTagChanged = (tags: string[]) => {
    setTag(tags);
  };

  useEffect(() => {
    console.log(tag);
  }, [tag]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-2">
      <TagInput onTagChanged={onTagChanged} />
      {/* <MyCommentContiner /> */}
    </div>
  );
}
export default TestPage;
