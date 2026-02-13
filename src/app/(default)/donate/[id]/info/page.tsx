import { getDonateDescription } from "@/domain/donate/api/getDonateDescription";

async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const info = await getDonateDescription(id);
  return (
    <p
      className={info ? "" : "flex-center text-gray-400"}
      dangerouslySetInnerHTML={{
        __html: info ? info : "후원 소개가 존재하지 않습니다",
      }}
    ></p>
  );
}

export default page;
