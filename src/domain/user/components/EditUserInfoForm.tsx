"use client";

import Button from "@/shared/components/Button";
import { useAuthStore } from "@/store/authStore";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { usePostImage } from "@/shared/api/usePostImage";
import { useUpdateMyInfo } from "@/domain/user/api/useUpdateMyInfo";
import { checkNickname } from "@/domain/login/api/checkNickname";
import { checkEmail } from "@/domain/login/api/checkEmail";
import { Alert } from "@/shared/utils/alert";

function EditUserInfoForm() {
  const me = useAuthStore((s) => s.me);
  const router = useRouter();

  const [nickname, setNickname] = useState(me?.nickname ?? "");
  const [email, setEmail] = useState(me?.email ?? "");
  const [profileImageUrl, setProfileImageUrl] = useState(
    me?.profileImageUrl ?? "",
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const postImage = usePostImage();
  const updateMyInfo = useUpdateMyInfo();

  const [nicknameAvailable, setNicknameAvailable] = useState<boolean | null>(
    null,
  );
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);

  if (!me) return null;

  const handleClickChangeImage = () => {
    fileInputRef.current?.click();
  };

  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    postImage.mutate(Array.from(files), {
      onSuccess: (res) => {
        if (!res.length || !res[0].imageUrl) return;
        setProfileImageUrl(res[0].imageUrl);
      },
    });
  };

  const handleNicknameCheck = async () => {
    if (!nickname.trim())
      return Alert({ text: "닉네임을 입력해주세요.", timer: 1500 });
    try {
      const { available, message } = await checkNickname(nickname.trim());
      setNicknameAvailable(available ?? false);
      Alert({ text: message, timer: 1500 });
    } catch (e) {
      Alert({ text: "닉네임 중복 체크 중 오류가 발생했습니다.", timer: 1500 });
    }
  };

  const handleEmailCheck = async () => {
    if (!email.trim())
      return Alert({ text: "이메일을 입력해주세요.", timer: 1500 });
    try {
      const { available, message } = await checkEmail(email.trim());
      setEmailAvailable(available ?? false);
      Alert({ text: message, timer: 1500 });
    } catch (e) {
      Alert({ text: "이메일 중복 체크 중 오류가 발생했습니다.", timer: 1500 });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMyInfo.mutate(
      {
        nickname,
        email,
        profileImageUrl,
      },
      {
        onSuccess: () => {
          router.replace("/mypage");
        },
      },
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-[1000px] w-full flex flex-col p-4 border rounded-lg border-gray-200 gap-5"
    >
      <div className="text-xl font-semibold mb-3">내 정보 수정</div>

      <div className="flex gap-5 items-center">
        <h3>프로필</h3>
        <div className="w-20 h-20 relative rounded-full bg-gray-100">
          <Image
            src={profileImageUrl}
            alt="profile image"
            fill
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        <Button
          type="button"
          color="skyblue"
          size="sm"
          className="p-2"
          onClick={handleClickChangeImage}
          disabled={postImage.isPending}
        >
          변경
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg, .jpeg, .png, .webp"
          className="hidden"
          onChange={handleChangeImage}
        />
      </div>
      <div className="flex gap-5 items-center">
        <label>닉네임</label>
        <input
          type="text"
          value={nickname}
          maxLength={12}
          onChange={(e) => {
            setNickname(e.target.value);
            setNicknameAvailable(null);
          }}
          className="border border-gray-300 rounded-md px-3 py-1 outline-none focus:ring-2 focus:ring-mainblue"
        />
        {nicknameAvailable === true ? (
          <span className="text-mainblue text-sm font-medium">확인 완료</span>
        ) : (
          <Button type="button" size="sm" onClick={handleNicknameCheck}>
            중복 확인
          </Button>
        )}
      </div>
      <div className="flex gap-5 items-center">
        <label>이메일</label>
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailAvailable(null);
          }}
          className="border border-gray-300 rounded-md px-3 py-1 outline-none focus:ring-2 focus:ring-mainblue"
        />
        {emailAvailable === true ? (
          <span className="text-mainblue text-sm font-medium">확인 완료</span>
        ) : (
          <Button type="button" size="sm" onClick={handleEmailCheck}>
            중복 확인
          </Button>
        )}
      </div>
      <div className="flex justify-end gap-4 mt-4">
        <button
          type="button"
          className="hover:text-mainblue transition"
          onClick={() => router.replace("/mypage")}
        >
          취소
        </button>
        <Button type="submit" disabled={updateMyInfo.isPending}>
          저장
        </Button>
      </div>
    </form>
  );
}
export default EditUserInfoForm;
