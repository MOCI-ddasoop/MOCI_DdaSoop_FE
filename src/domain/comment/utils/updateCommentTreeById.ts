import { CommentResponse } from "../types";

export function updateCommentTreeById(
	comments: CommentResponse[],
	targetId: number,
	updateFn: (comment: CommentResponse) => CommentResponse,
): CommentResponse[] {
	return comments.map((comment) => {
		if (comment.id === targetId) {
			return updateFn(comment);
		}
		if (comment.replies && comment.replies.length > 0) {
			return {
				...comment,
				replies: updateCommentTreeById(comment.replies, targetId, updateFn),
			};
		}
		return comment;
	});
}
