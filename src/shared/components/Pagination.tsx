"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { MdKeyboardDoubleArrowLeft,MdKeyboardArrowLeft,MdKeyboardArrowRight,MdKeyboardDoubleArrowRight} from "react-icons/md";

interface UrlPaginationProps {
  totalPages: number;
  mode?: "url";
  pageParamName?: string;
}

interface StatePaginationProps {
  totalPages: number;
  mode: "state";
  currentPage: number;
  onPageChange: (page: number) => void;
}

type PaginationProps = UrlPaginationProps | StatePaginationProps;

const baseButton = "w-9 h-9 flex items-center justify-center rounded-full text-base font-medium ";
const pageButtonActive = `${baseButton} bg-mainblue text-white`;
const pageButtonNormal = `${baseButton} bg-pastelblue text-black`;
const navButton = `${baseButton}`;
const navButtonDisabled = `${baseButton} cursor-not-allowed`;

// Navigation 버튼
type NavButtonProps = {
    targetPage: number;
    disabled: boolean;
    children: React.ReactNode;
    mode: "url" | "state";
    createPageHref: (page: number) => string;
    handleStateChange: (page: number) => void;
  };

  const NavButton = ({
    targetPage, 
    disabled, 
    children, 
    mode, 
    createPageHref, 
    handleStateChange
   }: NavButtonProps) => {
  if (disabled) {
    return (
      <button className={navButtonDisabled} disabled>
        {children}
      </button>
    );
  }

   if(mode === "state"){
    return (
      <button 
        className={navButton}
        onClick={() => handleStateChange(targetPage)}
      >
        {children}
      </button>
    )
  }

  return (
    <Link 
      href={createPageHref(targetPage)} 
      className={navButton}
    >
      {children}
    </Link>
    ) 
  };

  // 페이지네이션 버튼
  type PageButtonProps = {
  page: number;
  currentPage: number;
  mode: "url" | "state";
  createPageHref: (page: number) => string;
  handleStateChange: (page: number) => void;
  };

  const PageButton = ({ 
    page, 
    currentPage, 
    mode, 
    createPageHref, 
    handleStateChange 
  }: PageButtonProps) => {
  const isActive = page === currentPage;
  const className = isActive ? pageButtonActive : pageButtonNormal;

    if(mode === "state"){
      return (
        <button
          className={className}
          onClick={() => handleStateChange(page)}
        >
          {page}
        </button>
      )
    }
    return (
      <Link
        href={createPageHref(page)}
        className={className}
      >
        {page}
      </Link>
    )
  };

function Pagination(props: PaginationProps) {
  const { totalPages } = props;
  const mode = props.mode ?? "url";
  const searchParams = useSearchParams();
  const pathname = usePathname();

  if(totalPages <= 1) return null;

  const currentPage = mode === "url"
    ? Number(
        searchParams.get((props as UrlPaginationProps).pageParamName || "page")
      ) || 1
    : (props as StatePaginationProps).currentPage;

  const PAGE_GROUP_SIZE = 5;
  const currentGroup = Math.ceil(currentPage / PAGE_GROUP_SIZE);
  const startPage = (currentGroup - 1) * PAGE_GROUP_SIZE + 1;
  const endPage = Math.min(startPage + PAGE_GROUP_SIZE - 1, totalPages);

  const pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

  //url 생성 함수 
  const createPageHref = (page: number) => {
  if (mode === "url") {
    const params = new URLSearchParams(searchParams);
    const pageParamName = (props as UrlPaginationProps).pageParamName || "page";
    params.set(pageParamName, page.toString());
    return `${pathname}?${params.toString()}`;
  }
  return "#"; //state 모드일 때는 사용되지 않음
};

  const handleStateChange = (page:number) => {
    if(mode === "state"){
      (props as StatePaginationProps).onPageChange(page);
    }
  }

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <div className="py-5 flex items-center justify-center gap-4">
      <NavButton 
        targetPage = {1} 
        disabled={isFirstPage}
        mode={mode}
        createPageHref={createPageHref}
        handleStateChange={handleStateChange}
      >
        <MdKeyboardDoubleArrowLeft size={24} className={isFirstPage ? "text-gray" : "text-mainblue"} />
      </NavButton>

      <NavButton 
        targetPage={currentPage - 1} 
        disabled={isFirstPage}
        mode={mode}
        createPageHref={createPageHref}
        handleStateChange={handleStateChange}
      >
        <MdKeyboardArrowLeft size={24} className={isFirstPage ? "text-gray" : "text-mainblue"} />
      </NavButton>

      {pageNumbers.map((page) => (
        <PageButton 
          key={page} 
          page={page}
          currentPage={currentPage}
          mode={mode}
          createPageHref={createPageHref}
          handleStateChange={handleStateChange}
        />
      ))}

      <NavButton 
        targetPage={currentPage + 1} 
        disabled={isLastPage}
        mode={mode}
        createPageHref={createPageHref}
        handleStateChange={handleStateChange}
      >
        <MdKeyboardArrowRight size={24} className={isLastPage ? "text-gray" : "text-mainblue"} />
      </NavButton>

      <NavButton 
        targetPage={totalPages} 
        disabled={isLastPage}
        mode={mode}
        createPageHref={createPageHref}
        handleStateChange={handleStateChange}
      >
        <MdKeyboardDoubleArrowRight size={24} className={isLastPage ? "text-gray" : "text-mainblue"} />
      </NavButton>
    </div>
  );
}
export default Pagination;