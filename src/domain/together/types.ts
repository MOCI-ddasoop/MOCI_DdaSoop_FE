import { components } from "@/types/api/v1";

export type TogetherResponse = components["schemas"]["TogetherResponse"];
// id?
// title?
// description?
// category? : "PLOGGING" | "CLEANUP" | "RECYCLING";
// mode? : "ONLINE" | "OFFLINE";
// capacity?
// status? : "RECRUITING" | "CLOSED";
// organizerId?

export interface TogetherPageProps {
  searchParams: Promise<{
    category?: string;
    isOnline?: string;
    page?: string;
    sort?: string;
  }>;
}

// 카테고리, 온/오프라인, 모집중/모집완료 ->  타입지정해도 좋을듯
export type TogetherListItemProps = {
  id: number;
  image: string;
  name: string;
  category: string;
  isOnline: string;
  href: string;
  widthClass?: string;
};
