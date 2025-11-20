import {twMerge, type ClassNameValue} from 'tailwind-merge';
import {clsx} from 'clsx';

export default function tw(...arg: ClassNameValue[]) {
  return twMerge(clsx(arg))
}

// 애니메이션 gsap << next.js에서 좀 비효율적이다? 오류가 생긴다? , sweetalert2, swiper
// SSR에서 FRAMER가 조금 더 유리하다?
// AXIOS - FETCH 라이브러리, REACT-HOOK-FORM - FORM 검증 제어 라이브러리, ZOD - 런타임 타입 검증 라이브러리
// REACT-ICON 설치 << 