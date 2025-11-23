function CommentInput() {
  return (
    <form className="flex items-center gap-2">
      <input type="text" placeholder="댓글을 입력해주세요." className="w-full p-2 rounded-md border border-gray-300" />
      <button type="submit" className="bg-amber-400 text-white p-2 rounded-md">댓글 작성</button>
    </form>
  )
}
export default CommentInput