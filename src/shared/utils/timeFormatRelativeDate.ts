export function formatRelativeDate(dateString: string): string {
	const date = new Date(dateString);

	if (Number.isNaN(date.getTime())) {
		console.warn("Invalid date string:", dateString);
		return "";
	}

	const now = new Date();
	const diffMs = now.getTime() - date.getTime();

	if (diffMs < 0) {
		return "방금 전";
	}

	const seconds = Math.floor(diffMs / 1000);
	if (seconds < 60) {
		return `${seconds}초 전`;
	}

	const minutes = Math.floor(seconds / 60);
	if (minutes < 60) {
		return `${minutes}분 전`;
	}

	const hours = Math.floor(minutes / 60);
	if (hours < 24) {
		return `${hours}시간 전`;
	}

	const days = Math.floor(hours / 24);
	if (days < 7) {
		return `${days}일 전`;
	}

	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();
	const nowYear = now.getFullYear();

	if (year === nowYear) {
		return `${month}월 ${day}일`;
	}

	return `${year}년 ${month}월 ${day}일`;
}
