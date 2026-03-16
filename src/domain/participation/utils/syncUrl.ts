import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const syncUrl = (
  type: "together" | "donate",
  category: string[] = [],
  isOnline: string[] = [],
  sort: string = "LATEST",
  page: number = 1,
  router: AppRouterInstance,
) => {
  const params = new URLSearchParams();
  if (category.length > 0) {
    params.set("category", category.join(","));
  }
  if (isOnline.length > 0) {
    params.set("isOnline", isOnline.join(","));
  }
  params.set("page", page.toString());
  if (sort !== "LATEST") params.set("sort", sort);
  router.replace(`/${type}?${params.toString()}`);
};
