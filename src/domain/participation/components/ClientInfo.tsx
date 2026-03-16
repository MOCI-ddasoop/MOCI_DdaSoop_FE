"use client";
import { sanitizeHtml } from "@/shared/utils/sanitizeHtml";
import { useGetParticipationInfo } from "../api/useGetParticipationInfo";

function ClientInfo({ type, id }: { type: "together" | "donate"; id: string }) {
  const { data, isPending } = useGetParticipationInfo(type, id);
  return isPending ? (
    <div className="h-28 flex-center">
      <div className={`loader ${type === "donate" ? "loader-red" : ""}`} />
    </div>
  ) : (
    <p
      className={data?.data ? "" : "flex-center text-gray-400"}
      dangerouslySetInnerHTML={{
        __html: data?.data
          ? typeof data.data === "string"
            ? sanitizeHtml(data.data)
            : sanitizeHtml(data.data.description)
          : "모임 소개가 존재하지 않습니다",
      }}
    ></p>
  );
}

export default ClientInfo;
