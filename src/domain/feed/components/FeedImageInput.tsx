"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

import { FaPlus } from "react-icons/fa";
import { FaRegImages } from "react-icons/fa6";
import tw from "../../../shared/utils/tw";
import ImageSwiper from "../../../shared/components/ImageSwiper";

export type FeedImage = Partial<File> & {
	url?: string;
	name: string;
	width?: string;
	height?: string;
};

function FeedImageInput({
	slideList,
	setSlideList,
}: {
	slideList: FeedImage[];
	setSlideList: Dispatch<SetStateAction<FeedImage[]>>;
}) {
	const [isDragging, setIsDragging] = useState(false);

	const MAX_TOTAL = 5;

	const handleAddSlide = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selected = e.target.files;
		if (!selected) return;

		const newFiles = Array.from(selected);

		if (slideList.length + newFiles.length > MAX_TOTAL) {
			alert(`총 ${MAX_TOTAL}개까지만 업로드할 수 있어요.`);
			const slicedFiles = newFiles.slice(0, MAX_TOTAL - slideList.length);
			setSlideList((prev) => [...prev, ...slicedFiles]);
			return;
		}
		setSlideList((prev) => [...prev, ...newFiles]);
		e.target.value = "";
	};

	const handleDeleteSlide = (index: number) => {
		setSlideList((prev) => prev.filter((_, i) => i !== index));
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
			file.type.startsWith("image/")
		);

		if (imageFiles.length !== newFiles.length) {
			alert("이미지 파일만 업로드할 수 있어요.");
		}

		if (slideList.length + imageFiles.length > MAX_TOTAL) {
			alert(`총 ${MAX_TOTAL}개까지만 업로드할 수 있어요.`);
			return;
		}
		setSlideList((prev) => [...prev, ...imageFiles]);
	};

	const dragAndDropZone = (
		<div className={`w-full h-full flex-center`}>
			<div className="w-full h-full p-2">
				<label
					htmlFor="file"
					className={tw(
						"flex-center flex-col w-full h-full border-4 rounded-lg border-dashed p-2 text-mainblue border-mainblue bg-white hover:text-white hover:border-white hover:bg-mainblue",
						isDragging && "text-white border-white bg-mainblue"
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
				slideList.length >= 5 ? "cursor-no-drop" : ""
			)}
		>
			<FaPlus size={"1rem"} />
			<span
				className={tw(
					"text-sm",
					slideList.length === 5 ? "text-mainblue" : "text-black"
				)}
			>
				{slideList.length}/5
			</span>
		</label>
	);

	return (
		<>
			<ImageSwiper
				slideList={slideList}
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
