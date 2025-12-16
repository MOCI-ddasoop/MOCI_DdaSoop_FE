import Image from "next/image"

function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
     <div className="bg-[#A1D4F1] w-full min-h-screen relative overflow-hidden">
      <div className="absolute bottom-0 w-[200%] h-[30vh] bg-[#C8E66A] rounded-t-[50%] left-1/2 -translate-x-1/2"/>

      <div className="relative z-10 flex justify-center min-h-screen px-15 pt-[60px]">
        <div className="w-full max-w-screen-xl flex items-center justify-between">
       {/*나무 이미지*/}
        <div className="relative w-[500px] h-[500px]">
          <Image
            src="/loginTree.svg"
            fill
            alt="나무이미지"
            className="object-contain"
            priority
          />
        </div>
        {/*로그인 폼*/}
        <div className="w-full max-w-[450px]">
          {children}
        </div>

        </div>
      </div>
    </div>
  );
}
export default LoginLayout