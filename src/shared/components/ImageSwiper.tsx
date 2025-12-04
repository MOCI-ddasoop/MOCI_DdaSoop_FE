"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";

import backCircle from "@/assets/icons/backCircle.svg";
import forwardCircle from "@/assets/icons/forwardCircle.svg";
import { IoClose } from "react-icons/io5";

type Slide = Partial<File> & { url?: string };

interface ImageSwiperProps {
	slideList: Slide[];
	mode?: "default" | "input";
	mainSlideInput?: React.ReactElement;
	thumbsSlideInput?: React.ReactElement;
	deleteSlide?: (index: number) => void;
}

export const dummyImageList = [
	{
		url: "https://i.namu.wiki/i/qwuEdVbMFB8VPtfK38ltdrbnNGmu__9oOdcVNPec3agexDRCaGPXtAeVoacZQr_Kurwn1wl2LfYCk8yJB3LTnQwmRq-uvygSvvqM5WOg2ysW6zaB46XPQOGToMB4uuq460tB0f27iGrLOQGr074UEA.webp",
	},
	{
		url: "https://www.nintendo.com/kr/character/pikmin/assets/img/book/blue_pikmin/3/1.png",
	},
	{
		url: "https://cdn.gamemeca.com/data_center/299/560/20250121121637.jpg",
	},
];

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
				className="absolute top-1 right-0 opacity-20 hover:opacity-100"
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
				modules={[FreeMode, Navigation, Thumbs]}
				centeredSlides={true}
				onSwiper={handleMainSwiper}
				className="w-full h-4/5 box-border"
			>
				{slideList.length !== 0 ? (
					slideList.map(({ url }, idx) => (
						<SwiperSlide key={idx}>
							<div className={`w-full h-full flex-center`}>
								{/* <Image/> 삽입 예정 */}
								<Image
									src={
										url ??
										"https://i.pinimg.com/736x/89/77/cd/8977cdb66c81b51e69e8c148f227e5c1.jpg"
									}
									alt=""
									width={500}
									height={500}
								/>
							</div>
						</SwiperSlide>
					))
				) : mode === "input" ? (
					<SwiperSlide>{mainSlideInput}</SwiperSlide>
				) : (
					""
				)}
				<div className="position-center w-full flex-center justify-between z-10">
					<button
						ref={prevButtonRef}
						className="cursor-pointer opacity-50 hover:opacity-100 [&.swiper-button-disabled]:opacity-0 [&.swiper-button-disabled]:hover:opacity-0"
					>
						<Image src={backCircle} alt="왼쪽으로 이동" />
					</button>
					<button
						ref={nextButtonRef}
						className="cursor-pointer opacity-50 hover:opacity-100 [&.swiper-button-disabled]:opacity-0 [&.swiper-button-disabled]:hover:opacity-0"
					>
						<Image src={forwardCircle} alt="오른쪽으로 이동" />
					</button>
				</div>
			</Swiper>

			{/* Thumbs swiper */}
			<Swiper
				ref={thumbsSwiperRef}
				onSwiper={(swiper) => handleThumbsSwiper(swiper)}
				spaceBetween={10}
				slidesPerView={mode === "input" ? "auto" : 5}
				centeredSlides={false}
				freeMode={true}
				watchSlidesProgress={true}
				modules={[FreeMode, Navigation, Thumbs]}
				className="w-full flex-center justify-start h-1/5"
			>
				{slideList.map(({ url }, index) => (
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
									src={
										url ??
										"https://i.pinimg.com/736x/89/77/cd/8977cdb66c81b51e69e8c148f227e5c1.jpg"
									}
									alt=""
									height={500}
									width={500}
								/>
							</div>
						</div>
					</SwiperSlide>
				))}
				{mode === "input" ? <SwiperSlide>{thumbsSlideInput}</SwiperSlide> : ""}
			</Swiper>
		</>
	);
}
export default ImageSwiper;
