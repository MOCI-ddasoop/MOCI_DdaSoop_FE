import { IoMdSearch } from "react-icons/io";

async function SearchQueryNotation({
  searchParams,
}: {
  searchParams: Promise<{ query: string }>;
}) {
  const { query } = await searchParams;

  return (
    query && (
      <div className="fixed bottom-10 left-20 flex items-center gap-2 px-4 py-2 bg-white border border-mainblue rounded-md text-xl font-semibold">
        <IoMdSearch className="text-mainblue" size={24} />
        {query}
      </div>
    )
  );
}
export default SearchQueryNotation;
