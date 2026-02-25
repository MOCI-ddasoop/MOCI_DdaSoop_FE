"use client";

import React, { useState } from "react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

import { FaPlus } from "react-icons/fa";
import { FaRegImages } from "react-icons/fa6";
import tw from "../../../shared/utils/tw";
import ImageSwiper from "../../../shared/components/ImageSwiper";
import { ImageBase } from "@/shared/types/types";
import { usePostImage } from "@/shared/api/usePostImage";
import { Alert } from "@/shared/utils/alert";

function FeedImageInput({
  value,
  setValue,
}: {
  value: ImageBase[];
  setValue: (images: ImageBase[]) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const { mutate: uploadImageFn } = usePostImage();

  const MAX_TOTAL = 10;

  // TODO: image upload api 호출중에 loader 표시
  const addSlide = (files: File[]) => {
    uploadImageFn(files, {
      onSuccess: (data) => {
        setValue([...value, ...data]);
      },
      onError: (error) => {
        const message = error.response?.data.message;
        Alert({
          title: "이미지 업로드 실패",
          text: `${message}`,
          timer: 1500,
        });
      },
    });
  };
  const handleAddSlide = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (!selected) return;

    const newFiles = Array.from(selected);

    if (value.length + newFiles.length > MAX_TOTAL) {
      Alert({
        title: "이미지 업로드 실패",
        text: `총 ${MAX_TOTAL}개까지만 업로드할 수 있어요.`,
        timer: 1500,
      });
      return;
    }
    addSlide(newFiles);
    e.target.value = "";
  };

  const handleDeleteSlide = (index: number) => {
    setValue(value.filter((_, i) => i !== index));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const newFiles = Array.from(e.dataTransfer.files);
    const imageFiles = newFiles.filter((file) =>
      file.type.startsWith("image/"),
    );

    if (imageFiles.length !== newFiles.length) {
      Alert({
        title: "이미지 업로드 실패",
        text: "이미지 파일만 업로드할 수 있어요.",
        timer: 1500,
      });
    }

    if (value.length + imageFiles.length > MAX_TOTAL) {
      Alert({
        title: "이미지 업로드 실패",
        text: `총 ${MAX_TOTAL}개까지만 업로드할 수 있어요.`,
        timer: 1500,
      });
      return;
    }
    addSlide(imageFiles);
  };

  const dragAndDropZone = (
    <div className={`w-full h-full flex-center`}>
      <div className="w-full h-full p-2">
        <label
          htmlFor="file"
          className={tw(
            "flex-center flex-col w-full h-full border-4 rounded-lg border-dashed p-2 text-mainblue border-mainblue bg-white hover:text-white hover:border-white hover:bg-mainblue",
            isDragging && "text-white border-white bg-mainblue",
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <FaRegImages size={"8rem"} />
          <div>여기에 파일을 놓거나 클릭하여</div>
          <div>이미지를 추가하세요.</div>
        </label>
      </div>
    </div>
  );

  const thumbsInput = (
    <label
      htmlFor="file"
      className={tw(
        "flex-center flex-col w-12 h-full",
        value.length >= MAX_TOTAL ? "cursor-no-drop" : "",
      )}
    >
      <FaPlus size={"1rem"} />
      <span
        className={tw(
          "text-sm",
          value.length === MAX_TOTAL ? "text-mainblue" : "text-black",
        )}
      >
        {value.length}/{MAX_TOTAL}
      </span>
    </label>
  );

  return (
    <>
      <ImageSwiper
        slideList={value.map((slide) => ({
          imageUrl: slide.imageUrl,
          imageFileName: slide.originalFileName,
        }))}
        mode={"input"}
        mainSlideInput={dragAndDropZone}
        thumbsSlideInput={thumbsInput}
        deleteSlide={handleDeleteSlide}
      />

      {/* input */}
      <input
        type="file"
        id="file"
        className="sr-only"
        accept=".jpg, .jpeg, .png, .webp"
        multiple
        onChange={handleAddSlide}
      />
    </>
  );
}
export default FeedImageInput;
