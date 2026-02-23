import CommentGroupByFeedContainer from "@/domain/comment/components/CommentGroupByFeedContainer";
import { Suspense } from "react";

function TestPage() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <Suspense fallback={<div>loading...</div>}>
        <CommentGroupByFeedContainer />
      </Suspense>
    </div>
  );
}
export default TestPage;
