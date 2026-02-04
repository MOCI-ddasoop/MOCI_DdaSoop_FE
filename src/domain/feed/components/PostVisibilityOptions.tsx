import { useMemo } from "react";
import { FeedCreateRequest } from "../types";
import { FeedOptionData } from "./FeedCreatorModal";

function PostVisibilityOptions({
	togetherInfo,
	value: selectedOption,
	setValue: setSelectedOption,
}: {
	togetherInfo: FeedOptionData | undefined;
	value: FeedCreateRequest["visibility"] | null | undefined;
	setValue: (prev: FeedCreateRequest["visibility"]) => void;
}) {
	const options = useMemo(() => {
		const options = [
			{ value: "PUBLIC", label: "공개" },
			{ value: "PRIVATE", label: "비공개" },
			{ value: "MEMBERS", label: "멤버에게만 공개" },
			{ value: "NOTICE", label: "공지" },
		];
		if (!togetherInfo) {
			return options.filter(
				({ value }) => value === "PUBLIC" || value === "PRIVATE",
			);
		} else if (togetherInfo && togetherInfo.user.role === "member") {
			return options.filter(
				({ value }) => value === "PUBLIC" || value === "MEMBERS",
			);
		} else {
			return options.filter(
				({ value }) =>
					value === "PUBLIC" || value === "MEMBERS" || value === "NOTICE",
			);
		}
	}, [togetherInfo]);
	return (
		<fieldset className="flex border-t border-t-pastelblue px-2 pt-2 gap-2">
			{options.map(({ value, label }, index) => (
				<div key={index}>
					<input
						type="radio"
						id={value}
						name="postVisibility"
						value={value}
						onChange={(e) =>
							setSelectedOption(
								e.target.value as FeedCreateRequest["visibility"],
							)
						}
						checked={value === selectedOption}
					/>
					<label htmlFor={value} className="p-1">
						{label}
					</label>
				</div>
			))}
		</fieldset>
	);
}
export default PostVisibilityOptions;
