"use client";
import Button from "@/shared/components/Button";
import { useState } from "react";
import DonateModal from "./DonateModal";
import { useAuthStore } from "@/store/authStore";

function DonateButton() {
  const [isOpen, setIsOpen] = useState(false);
  const user = useAuthStore((s) => s.me);
  const handleClick = () => {
    if (!user) {
      alert("로그인이 필요한 서비스입니다.");
      return;
    }
    setIsOpen(true);
  };
  return (
    <>
      <Button color="red" className="w-60" onClick={handleClick}>
        후원하기
      </Button>
      {isOpen && (
        <DonateModal
          title="후원1"
          organization="후원단체"
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

export default DonateButton;
