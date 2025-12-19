"use client";
import Button from "@/shared/components/Button";
import { useState } from "react";
import DonateModal from "./DonateModal";

function DonateButton() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button color="red" className="w-60" onClick={() => setIsOpen(true)}>
        후원하기
      </Button>
      {isOpen && <DonateModal onClose={() => setIsOpen(false)} />}
    </>
  );
}

export default DonateButton;
