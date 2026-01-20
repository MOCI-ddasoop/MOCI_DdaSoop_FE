"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import {
	FreeMode,
	Keyboard,
	Navigation,
	Pagination,
	Thumbs,
} from "swiper/modules";

import backwardCircle from "@/assets/icons/backwardCircle.png";
import forwardCircle from "@/assets/icons/forwardCircle.png";
import { IoClose } from "react-icons/io5";

interface ImageSwiperProps {
	slideList: { imageUrl?: string; imageFileName?: string }[];
	mode?: "default" | "input" | "feed";
	mainSlideInput?: React.ReactElement;
	thumbsSlideInput?: React.ReactElement;
	deleteSlide?: (index: number) => void;
}

function ImageSwiper({
	slideList,
	mode = "default",
	mainSlideInput,
	thumbsSlideInput,
	deleteSlide,
}: ImageSwiperProps) {
	const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
	const mainSwiperRef = useRef<SwiperRef>(null);
	const thumbsSwiperRef = useRef<SwiperRef>(null);
	const prevButtonRef = useRef(null);
	const nextButtonRef = useRef(null);

	useEffect(() => {
		const mainSwiperEl = mainSwiperRef.current;
		if (!mainSwiperEl) return;
		const mainSwiper = mainSwiperEl.swiper;

		// prev,next button
		if (!mainSwiper.params.navigation || mainSwiper.params.navigation === true)
			return;
		mainSwiper.params.navigation.prevEl = prevButtonRef.current;
		mainSwiper.params.navigation.nextEl = nextButtonRef.current;

		mainSwiper.navigation.init();
		mainSwiper.navigation.update();
	}, []);

	const handleMainSwiper = (swiper: SwiperType) => {
		const wrapper = swiper.wrapperEl;
		if (!wrapper) return;

		wrapper.classList.add("main-swiper-wrapper");
		swiper.update();

		requestAnimationFrame(() => {
			swiper.keyboard.enable();
		});
	};

	const handleThumbsSwiper = (swiper: SwiperType) => {
		const wrapper = swiper.wrapperEl;
		if (!wrapper) return;

		wrapper.classList.add("thumbs-swiper-wrapper");
		setThumbsSwiper(swiper);
		swiper.update();
	};

	const deleteButton = (index: number) => {
		if (mode !== "input") return;
		if (!deleteSlide) return;
		return (
			<button
				onClick={() => deleteSlide(index)}
				className="absolute top-1 right-0 z-10 opacity-20 hover:opacity-100"
			>
				<IoClose />
			</button>
		);
	};

	return (
		<>
			{/* main swiper */}
			<Swiper
				ref={mainSwiperRef}
				spaceBetween={10}
				navigation={false}
				thumbs={{ swiper: thumbsSwiper }}
				modules={[FreeMode, Navigation, Thumbs, Keyboard, Pagination]}
				centeredSlides={true}
				keyboard={{ enabled: true }}
				pagination={
					mode === "feed"
						? {
								clickable: true,
						  }
						: false
				}
				onSwiper={handleMainSwiper}
				className={`w-full ${mode === "feed" ? "h-full" : "h-4/5"} box-border`}
			>
				{slideList.length !== 0 ? (
					slideList.map(({ imageUrl: url }, idx) => (
						<SwiperSlide key={idx}>
							<div
								className={`w-full h-full flex-center ${
									mode === "input" ? "bg-black" : ""
								}`}
							>
								{/* <Image/> 삽입 예정 */}
								<Image
									src={url ?? "/defaultFeedImage.png"}
									alt=""
									fill
									className="object-contain"
								/>
							</div>
						</SwiperSlide>
					))
				) : mode === "input" ? (
					<SwiperSlide>{mainSlideInput}</SwiperSlide>
				) : (
					<SwiperSlide>
						<div className={`w-full h-full flex-center bg-white`}>
							<Image
								src={"/defaultFeedImage.png"}
								alt=""
								fill
								className="object-contain"
							/>
						</div>
					</SwiperSlide>
				)}
				<div className="position-center w-full flex-center justify-between z-10 p-2">
					<button
						ref={prevButtonRef}
						className="cursor-pointer opacity-50 hover:opacity-100 [&.swiper-button-disabled]:opacity-0 [&.swiper-button-disabled]:hover:opacity-0 [&.swiper-button-disabled]:cursor-default"
					>
						<Image
							src={backwardCircle}
							alt="왼쪽으로 이동"
							className="w-6 select-none pointer-events-none"
						/>
					</button>
					<button
						ref={nextButtonRef}
						className="cursor-pointer opacity-50 hover:opacity-100 [&.swiper-button-disabled]:opacity-0 [&.swiper-button-disabled]:hover:opacity-0 [&.swiper-button-disabled]:cursor-default"
					>
						<Image
							src={forwardCircle}
							alt="오른쪽으로 이동"
							className="w-6 select-none pointer-events-none"
						/>
					</button>
				</div>
			</Swiper>

			{/* Thumbs swiper */}
			{mode === "feed" ? (
				""
			) : (
				<Swiper
					ref={thumbsSwiperRef}
					onSwiper={(swiper) => handleThumbsSwiper(swiper)}
					spaceBetween={10}
					slidesPerView={mode === "input" ? "auto" : 5}
					centeredSlides={false}
					freeMode={true}
					watchSlidesProgress={true}
					modules={[FreeMode, Navigation, Thumbs]}
					className="w-full flex items-center justify-start h-1/5"
				>
					{slideList.map(({ imageUrl: url }, index) => (
						<SwiperSlide key={index}>
							<div className="p-1 h-full">
								<div
									className={`slide flex-center w-full h-full bg-black/30 rounded-lg relative overflow-hidden ${
										mode === "input" ? "aspect-square" : ""
									}`}
								>
									{deleteButton(index)}
									{/* 이미지 삽입 */}
									<Image
										src={url ?? "/defaultFeedImage.png"}
										alt=""
										fill
										className="object-contain"
									/>
								</div>
							</div>
						</SwiperSlide>
					))}
					{mode === "input" ? (
						<SwiperSlide>{thumbsSlideInput}</SwiperSlide>
					) : (
						""
					)}
				</Swiper>
			)}
		</>
	);
}
export default ImageSwiper;
