"use client";
import { debounce } from "@/shared/utils/debounce";
import tw from "@/shared/utils/tw";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { InputHTMLAttributes } from "react";
import { IoMdSearch } from "react-icons/io";

function SearchInput({ className }: InputHTMLAttributes<HTMLInputElement>) {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const { replace } = useRouter();

	const handleSearch = debounce((arg: unknown) => {
		if(typeof arg !== "string")return;
		const term = arg;
		const params = new URLSearchParams(searchParams);
		if (term) {
			params.set("query", term);
		} else {
			params.delete("query");
		}
		replace(`${pathname}?${params.toString()}`);
	}, 300);

	return (
		<div
			className={tw(
				"flex-center justify-between border border-mainblue rounded-lg py-1 px-2 w-full",
				className
			)}
		>
			<input
				placeholder="검색어를 입력해보세요."
				className="w-[calc(100%-24px)] focus:outline-0"
				onChange={(e) => handleSearch(e.target.value)}
				defaultValue={searchParams.get("query")?.toString()}
			/>
			<IoMdSearch className="text-mainblue" size={24} />
		</div>
	);
}
export default SearchInput;
