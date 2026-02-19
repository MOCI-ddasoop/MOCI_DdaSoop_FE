"use client";
import ParticipationContainer from "@/domain/participation/components/ParticipationContainer";
import { useAuthStore } from "@/store/authStore";
import { useGetOwnDonationList } from "../api/useGetOwnDonationList";

function MyDonateSection() {
  const userId = useAuthStore((s) => s.me?.memberId);
  const { isError, isPending, data: items } = useGetOwnDonationList(userId!);

  return (
    <>
      {isError ? (
        <div className="w-full h-28 flex-center">
          <p className="text-gray-400">오류가 발생했습니다</p>
        </div>
      ) : isPending ? (
        <div className="w-full h-28 flex-center">
          <div className="loader loader-red"></div>
        </div>
      ) : (
        items && (
          <ParticipationContainer
            type="myDonate"
            items={items.data ?? []}
            currentPage={0}
            className="mb-10"
            isLogin={!!userId}
          />
        )
      )}
      {/* {items && <Pagination totalPages={items?.data.totalPages ?? 0} />} */}
    </>
  );
}

export default MyDonateSection;
