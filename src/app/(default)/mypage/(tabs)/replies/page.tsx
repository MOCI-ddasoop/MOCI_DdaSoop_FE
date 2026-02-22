import CommentGroupByFeedContainer from "@/domain/comment/components/CommentGroupByFeedContainer";
import { Suspense } from "react";

function page() {
  return (
  <Suspense fallback={<div>Loading...</div>}>
    <CommentGroupByFeedContainer />
  </Suspense>
  );
}
export default page;
