"use client";

import FeedCreateButton from "@/domain/feed/components/FeedCreateButton";
import Button from "@/shared/components/Button";

function UserAction() {
	const isMember = false;

	return (
		<div className="w-full h-fit flex-center flex-col">
			{isMember ? (
				<>
					<FeedCreateButton className="w-60" />
					<button
						type="button"
						className="self-end p-2 hover:underline hover:underline-offset-4"
					>
						탈퇴하기
					</button>
				</>
			) : (
				<Button className="w-60">참여하기</Button>
			)}
		</div>
	);
}

export default UserAction;
