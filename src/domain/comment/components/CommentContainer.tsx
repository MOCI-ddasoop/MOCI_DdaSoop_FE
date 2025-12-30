import tw from "@/shared/utils/tw";
import CommentItem from "./CommentItem";

interface CommentItemProps {
  id: number;
  profileImage: string;
  author: string;
  date: string;
  content: string;
  className?: string;
}

const COMMENT_LIST = Array.from({ length: 10 }).map((_, index) => ({
  id: index,
  profileImage:
    "https://gongu.copyright.or.kr/gongu/wrt/cmmn/wrtFileImageView.do?wrtSn=13002262&filePath=L2Rpc2sxL25ld2RhdGEvMjAxNi8yMS9DTFM2Lzc4MzA1MWJmLWYxZGMtNGFmMS05YTcxLWYzMmFkNTZmYjMyYQ==&thumbAt=Y&thumbSe=b_tbumb&wrtTy=10006",
  author: "John Doe",
  date: "2025년 1월 1일",
  content: "Hello, world!",
}));

function CommentContainer({
  className,
  onCommentTargetClick,
}: {
  className?: string;
  onCommentTargetClick?: (nickname: string | null) => void;
}) {
  return (
    <ul className={tw("w-full flex flex-col gap-2", className)}>
      {COMMENT_LIST.map((comment) => (
        <CommentItem
          key={comment.id}
          {...comment}
          onCommentTargetClick={onCommentTargetClick}
        />
      ))}
    </ul>
  );
}
export default CommentContainer;
