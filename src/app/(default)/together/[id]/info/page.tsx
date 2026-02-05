import { getTogetherDescription } from "@/domain/together/api/getTogetherDescription";
import { sanitizeHtml } from "@/shared/utils/sanitizeHtml/server";

async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: info } = await getTogetherDescription(id);
  return (
    <p
      className={info ? "" : "flex-center text-gray-400"}
      dangerouslySetInnerHTML={{
        __html: info ? sanitizeHtml(info) : "모임 소개가 존재하지 않습니다",
      }}
    ></p>
  );
}

export default page;
