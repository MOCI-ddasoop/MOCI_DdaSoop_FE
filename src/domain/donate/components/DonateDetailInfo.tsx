"use client";

import Capsule from "@/shared/components/Capsule";
import DonateButton from "@/domain/donate/components/DonateButton";

import { categoryType } from "@/shared/constants/filter";
import { useGetDonateById } from "../api/useGetDonateById";
import TreeProgress from "@/domain/participation/components/TreeProgress";
import ProgressBar from "@/domain/participation/components/ProgressBar";

type Props = {
  id: string;
};

function DonateDetailInfo({ id }: Props) {
  const { data, isPending } = useGetDonateById(id);

  if (isPending) {
    return (
      <div className="sticky top-20 w-62 h-fit flex flex-col gap-2">
        <div className="h-12 bg-gray-200 rounded animate-pulse" />
        <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
        <div className="h-40 bg-gray-200 rounded animate-pulse" />
        <div className="h-10 bg-gray-200 rounded animate-pulse" />
        <div className="h-12 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  if (!data?.data) {
    return (
      <div className="sticky top-20 w-62 h-fit p-4 bg-gray-50 rounded">
        <p className="text-gray-500">후원 정보를 찾을 수 없습니다.</p>
      </div>
    );
  }

  const {
    title,
    category,
    startDate,
    endDate,
    progress,
    dDay,
    goalAmount,
    imageUrls,
  } = data.data;

  return (
    <div className="sticky top-20 w-62 h-fit flex flex-col gap-1.5">
      <h1 className="text-2xl font-medium">{title}</h1>

      <div className="flex gap-2 flex-wrap">
        <Capsule
          text={categoryType[category ?? "ETC"]}
          type="category"
          readOnly
        />
      </div>

      <p className="text-sm text-gray-500">
        기간 {startDate} - {endDate}
      </p>

      <p className="text-lg">{dDay && dDay < 0 ? "기간종료" : `D-${dDay}`}</p>

      <TreeProgress progress={progress ?? 0} />

      <ProgressBar
        type="donate"
        progress={progress ?? 0}
        goal={goalAmount ?? 0}
        cardUI={false}
      />

      {dDay && dDay < 0 ? (
        <p className="text-gray-400 h-12 w-full flex-center">
          기간이 종료된 후원입니다
        </p>
      ) : (
        <DonateButton
          donateInfo={{ title, category }}
          imageUrl={imageUrls ? imageUrls[0] : undefined}
        />
      )}
    </div>
  );
}

export default DonateDetailInfo;
