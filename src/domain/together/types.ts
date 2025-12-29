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
