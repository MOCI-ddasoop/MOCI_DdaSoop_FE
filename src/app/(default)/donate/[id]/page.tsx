import { redirect } from "next/navigation";

async function page({
  params,
  queryParams,
}: {
  params: Promise<{ id: string }>;
  queryParams?: Promise<{
    orderId?: string;
    amount?: string;
    code?: string;
    message?: string;
  }>;
}) {
  const { id } = await params;
  const payQueryParams = await queryParams;
  if (!payQueryParams) redirect(`/donate/${id}/info`);
  else if (payQueryParams.code) {
    alert(`결제에 실패했습니다\n 오류코드 : ${payQueryParams.code}`);
  }
}

export default page;
