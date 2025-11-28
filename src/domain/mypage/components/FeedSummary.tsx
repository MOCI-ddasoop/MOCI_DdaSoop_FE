import tw from "@/shared/utils/tw";
import Image from "next/image";

interface FeedSummaryProps {
  id: number;
  content: string;
  author: string;
  createdAt: string;
  profileImage: string;
  FeedImage: string;
  className?: string;
}

function FeedSummary({
  id,
  content,
  author,
  createdAt,
  profileImage,
  FeedImage,
  className,
}: FeedSummaryProps) {
  return (
    <div
      className={tw("flex items-center gap-2 bg-gray-100 px-2 py-1", className)}
    >
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="relative w-11 h-11 rounded-full overflow-hidden border border-gray-300">
            <Image src={profileImage} alt={author} fill />
          </div>
          <div className="p-1 w-60 break-all line-clamp-2">
            <span className="font-bold inline">{author}</span>
            <span className="text-gray-500 inline break-all"> {content}</span>
          </div>
        </div>
        <div className="text-xs text-gray-500">{createdAt}</div>
      </div>

      <div className="relative h-15 w-15 rounded-md overflow-hidden border border-gray-300">
        <Image src={FeedImage} alt={author} fill />
      </div>
    </div>
  );
}
export default FeedSummary;
