import Image from "next/image";
// import treeGroup from "@/assets/tree-group.svg";
import BackButton from "@/shared/components/BackButton";

// 별들의 고정된 위치 배열 (상단 70%에만 배치)
const stars = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  left: (i * 7.3) % 100,
  top: (i * 11.7) % 70,
  delay: (i * 0.1) % 3,
  duration: 2 + (i % 3),
}));

function NotFound() {
  return (
    <div className="fixed inset-0 bg-gradient-to-b from-[#2B2D42] to-[#1A1B2E] overflow-hidden z-50">
      {/* 별들 */}
      <div className="absolute inset-0 z-0">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
        {/* 타이틀 */}
        <h1 className="text-5xl font-bold mb-8">따숲</h1>
        <p className="text-lg text-gray-300 mb-8">페이지를 찾을 수 없습니다.</p>

        <BackButton className="px-6 py-3 bg-transparent border border-gray-400 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-colors cursor-pointer">
          이전으로 돌아가기
        </BackButton>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-[#1c140b] to-gray-900/40" />


      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
        <div
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-96 h-96 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(252, 211, 77, 0.3) 0%, rgba(245, 158, 11, 0.2) 50%, transparent 100%)",
          }}
        ></div>

        {/* 나무 SVG */}
        <div className="relative z-10 mb-8">
          <Image src = "/tree-group.svg" alt="나무" width={300} height={300} />
        </div>
        <div className="absolute bottom-14 left-1/2 transform -translate-x-1/2 shake-rotate-animation w-48 h-screen overflow-hidden z-1">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 180 600"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            <defs>
              <linearGradient
                id="searchlightGradient"
                x1="90"
                y1="600"
                x2="90"
                y2="0"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#E4FF4C" stopOpacity="0.8" />
                <stop offset="0.3" stopColor="#E4FF4C" stopOpacity="0.5" />
                <stop offset="0.7" stopColor="#FFFFC4" stopOpacity="0.2" />
                <stop offset="1" stopColor="#FFFFC4" stopOpacity="0" />
              </linearGradient>
            </defs>

            <path
              d="M 90 600 L 30 0 L 150 0 Z"
              fill="url(#searchlightGradient)"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
export default NotFound;
