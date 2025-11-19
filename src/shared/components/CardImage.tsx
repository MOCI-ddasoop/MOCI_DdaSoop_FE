"use client";

import Image from "next/image";
import tw from "../utils/tw";
import { useState } from "react";
import { AiOutlineLock } from "react-icons/ai";
import { BsChatRight, BsHeart } from "react-icons/bs";

interface CardImageProps {
  src: string;
  alt: string;
  className?: string;
}

function CardImage({ src, alt, className }: CardImageProps) {
  return (
    <div
      className={tw(
        "bg-gray-100 rounded-md relative cursor-pointer group",
        className
      )}
    >
      <AiOutlineLock
        size={24}
        className="absolute top-2 right-2 z-20 text-gray-500/80 group-hover:text-white/80 duration-300"
      />

      <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-4 ">
        <div className="w-full h-full flex items-center justify-center">
          <p className="text-white text-sm line-clamp-8">
            컨텐츠 내용을 추가한다면 여기에
          </p>
        </div>
      </div>

      <div className="absolute bottom-4 left-0 w-full flex gap-2 bg-black/50 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-4 ">
        <div className="flex items-center justify-between gap-2">
          <BsChatRight size={24} className="text-white" />
          <p className="text-white">10</p>
        </div>
        <div className="flex items-center justify-between gap-2">
          <BsHeart size={24} className="text-white" />
          <p className="text-white">10</p>
        </div>
      </div>

      <Image src={src} alt={alt} fill className="object-cover z-0" />
    </div>
  );
}
export default CardImage;
