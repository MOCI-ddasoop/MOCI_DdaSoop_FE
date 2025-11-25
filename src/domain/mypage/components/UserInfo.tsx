import React from "react";
import Image from "next/image";
import Button from "@/shared/components/Button";
import tw from "@/shared/utils/tw";

const USER_PROFILE = {
  profileImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVnmRPneza69AMFkeXJ2uLkV9It4h9_ZB45FI4B8zE8dVc-pbjs35N1RQXisDKyojvLlA&usqp=CAU",
  nickname: "John Doe",
  email: "john.doe@example.com",
  likedCount: 100,
  commentedCount: 130,
  feedCount: 100,
  point: 742,
};

function UserInfo({ className }: { className?: string }) {
  return (
    <div className={tw("w-full h-full flex gap-10 items-center justify-center", className)}>
      <div className="w-40 h-40 relative rounded-full bg-gray-100">
        <Image
          src={USER_PROFILE.profileImage}
          alt="profile image"
          fill
          className="w-full h-full object-cover rounded-full"
        />
      </div>
      <div className="w-full h-full flex flex-col flex-1 gap-2">
        <p className="text-2xl font-bold">{USER_PROFILE.nickname}</p>
        <p className="text-sm text-gray-500">{USER_PROFILE.email}</p>
        <ul className="flex gap-2">
          <li className="pr-2 border-r border-gray-300">
            좋아요{" "}
            <span className="text-mainblue font-semibold">
              {USER_PROFILE.likedCount}
            </span>
          </li>
          <li className="px-2 border-r border-gray-300">
            댓글{" "}
            <span className="text-mainblue font-semibold">
              {USER_PROFILE.commentedCount}
            </span>
          </li>
          <li>
            피드{" "}
            <span className="text-mainblue font-semibold">
              {USER_PROFILE.feedCount}
            </span>
          </li>
        </ul>
        <div className="flex justify-between items-center">
          <Button color="skyblue" size="sm">로그아웃</Button>
          <div className="text-gray-500 hover:text-mainblue cursor-pointer underline">
            회원탈퇴
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserInfo;
