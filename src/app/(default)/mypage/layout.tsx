import React from "react";

function MyPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="w-full h-full flex flex-col items-center justify-center max-w-250 py-10 gap-6">
        {children}
      </div>
    </div>
  );
}
export default MyPageLayout;
