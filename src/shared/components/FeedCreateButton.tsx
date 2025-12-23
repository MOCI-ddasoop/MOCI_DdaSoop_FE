"use client";
import { useState } from "react";
import FeedCreatorModal from "./FeedCreatorModal";
import Button from "./Button";
import { RiQuillPenLine } from "react-icons/ri";
import tw from "../utils/tw";

function FeedCreateButton({ className }: { className?: string }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <Button
        className={tw("w-xs flex-center gap-3", className)}
        onClick={() => setIsOpen(true)}
      >
        <RiQuillPenLine size={"1.5rem"} />
        <span>피드 업로드</span>
      </Button>
      {isOpen && (
        <FeedCreatorModal onClose={() => setIsOpen(false)} isOpen={isOpen} />
      )}
    </>
  );
}
export default FeedCreateButton;
