function Loading() {
  return (
    <div className="flex justify-between pt-4">
      <div className="w-[calc(100%-280px)]">
        <div className="w-full aspect-10/7 bg-gray-200 animate-pulse rounded" />
      </div>
      <div className="sticky top-20 w-62 h-fit flex flex-col gap-3 animate-pulse">
        <div className="h-7 w-3/4 bg-gray-200 rounded" />
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-gray-200 rounded-full" />
          <div className="h-6 w-16 bg-gray-200 rounded-full" />
        </div>
        <div className="h-4 w-full bg-gray-200 rounded" />
        <div className="h-5 w-2/3 bg-gray-200 rounded" />
        <div className="h-35 w-full bg-gray-200 rounded-lg" />
        <div className="h-3 w-full bg-gray-200 rounded" />
        <div className="h-10 w-full bg-gray-200 rounded-md mt-2" />
      </div>
    </div>
  );
}

export default Loading;
