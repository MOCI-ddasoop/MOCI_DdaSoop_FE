"use client";

import { useRef } from "react";
import FormImageSwiper from "./FormImageSwiper";
import { Alert } from "@/shared/utils/alert";

const MAX_IMAGES = 5;

interface FormImageInputProps {
  images: File[];
  onChangeImages: (files: File[]) => void;
}

export default function FormImageInput({
  images,
  onChangeImages,
}: FormImageInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const previews = images.map((file) => URL.createObjectURL(file));

  const emptySlots =
    previews.length === 0 ? 3 : Math.max(0, MAX_IMAGES - previews.length);
  const slots = [...previews, ...Array(emptySlots).fill(null)];

  const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const newFiles = Array.from(e.target.files);
    const totalImages = images.length + newFiles.length;

    if (totalImages > MAX_IMAGES) {
      Alert({
        text: `최대 ${MAX_IMAGES}장까지만 업로드할 수 있어요.`,
        timer: 1500,
      });
      e.target.value = "";
      return;
    }

    onChangeImages([...images, ...newFiles]);
    e.target.value = "";
  };

  return (
    <div className="mt-4">
      <FormImageSwiper
        images={slots}
        onAddClick={() => inputRef.current?.click()}
      />

      <input
        ref={inputRef}
        type="file"
        accept=".jpg, .jpeg, .png, .webp"
        multiple
        hidden
        onChange={handleAddImages}
      />
    </div>
  );
}
