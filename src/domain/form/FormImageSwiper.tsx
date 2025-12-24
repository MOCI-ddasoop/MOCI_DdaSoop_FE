"use client";

import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";
import { IoChevronBackCircleOutline } from "react-icons/io5";
import { IoChevronForwardCircleOutline } from "react-icons/io5";
import { FaRegImages } from "react-icons/fa6";

interface FormImageSwiperProps {
  images: (string | null)[];
  onAddClick: () => void;
}

export default function FormImageSwiper({
  images,
  onAddClick,
}: FormImageSwiperProps) {
  const swiperRef = useRef<SwiperType | null>(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

   useEffect(() => {
    const swiper = swiperRef.current;
    if (!swiper || !prevRef.current || !nextRef.current) return;

    if (typeof swiper.params.navigation !== "boolean") {
      swiper.params.navigation = {
        ...(swiper.params.navigation ?? {}),
        prevEl: prevRef.current,
        nextEl: nextRef.current,
      };
    }
    
    swiper.navigation.init();
    swiper.navigation.update();
  }, []);

  return (
    <div className="relative w-full px-3">
      <Swiper
        slidesPerView={3}
        spaceBetween={12}
        modules={[Navigation]}
        navigation={{}} 
         onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        className="w-full"
      >
        {images.map((img, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-[300px] h-[150px] border border-gray-300 rounded-lg overflow-hidden">
              {img ? (
                <>
                  <Image
                    src={img}
                    alt={`후원 이미지 ${index + 1}`}
                    fill
                    className="object-cover"
                  />

                  {index === 0 && (
                    <span className="absolute top-1 left-1 text-xs bg-mainblue text-white px-2 py-0.5 rounded">
                      대표 이미지
                    </span>
                  )}
                </>
              ) : (
                <button
                  type="button"
                  onClick={onAddClick}
                  className="w-full h-full flex flex-col items-center justify-center text-gray-400 hover:text-mainblue gap-2"
                >
                  <FaRegImages size={"2rem"} />
                  <span className="text-sm">사진을 추가하려면 클릭하세요</span>
                </button>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 이전 버튼 */}
      <button
        ref={prevRef}
        type="button"
        aria-label="이전 이미지"
        className=" absolute -left-5 top-1/2 -translate-y-1/2 z-10
                   text-gray-400 hover:text-mainblue transition"
      >
        <IoChevronBackCircleOutline size={25} />
      </button>

      {/* 다음 버튼 */}
      <button
        ref={nextRef}
        type="button"
        aria-label="다음 이미지"
        className=" absolute -right-5 top-1/2 -translate-y-1/2 z-10
                   text-gray-300 hover:text-mainblue transition"
      >
        <IoChevronForwardCircleOutline size={25} />
      </button>
    </div>
  );
}
