import CommentItem from "./CommentItem";
import tw from "@/shared/utils/tw";

interface CommentItemProps {
  id: number;
  profileImage: string;
  author: string;
  date: string;
  content: string;
  className?: string;
}

function CommentContainer({
  commentList,
  className,
}: {
  commentList: CommentItemProps[];
  className?: string;
}) {
  return (
    <ul className={tw("w-full flex flex-col gap-2", className)}>
      {commentList.map((comment) => (
        <CommentItem key={comment.id} {...comment} />
      ))}
    </ul>
  );
}
export default CommentContainer;
