import { getInitTogetherList } from "@/domain/together/api/getInitTogetherList";
import TogetherSection from "@/domain/together/components/TogetherSection";
import { queryKeys } from "@/shared/config/queryKeys";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Suspense } from "react";

async function Together() {
  const queryClient = new QueryClient();

  await queryClient.fetchQuery({
    queryKey: queryKeys.together.list({
      category: [],
      mode: undefined,
      status: undefined,
      sortType: "LATEST",
      page: 0,
      size: 12,
    }),
    queryFn: () => getInitTogetherList(),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HydrationBoundary state={dehydratedState}>
        <TogetherSection />
      </HydrationBoundary>
    </Suspense>
  );
}

export default Together;
