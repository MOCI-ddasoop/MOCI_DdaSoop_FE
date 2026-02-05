"use client";
import ParticipationContainer from "@/domain/participation/components/ParticipationContainer";
import { useGetOwnTogetherList } from "../api/useGetOwnTogetherList";
import { useAuthStore } from "@/store/authStore";

function MyTogetherSection() {
  const userId = useAuthStore((s) => s.me?.memberId);
  const { isError, isPending, data: items } = useGetOwnTogetherList(userId!);

  return (
    <>
      {isError ? (
        <div className="w-full h-28 flex-center">
          <p className="text-gray-400">오류가 발생했습니다</p>
        </div>
      ) : isPending ? (
        <div className="w-full h-28 flex-center">
          <div className="loader"></div>
        </div>
      ) : (
        items && (
          <ParticipationContainer
            type="myTogether"
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

export default MyTogetherSection;
