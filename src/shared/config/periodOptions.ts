/**
 * 기간 선택 옵션 
 * 후원제안하기 / 함께하기 생성하기 기간 선택이 필요한 폼에서 공통 사용 
 */

export type PeriodOption = {
  id: string;
  label: string;
  add: { 
    weeks?: number; 
    months?: number; 
    years?: number;
  };
}

export const PERIOD_OPTIONS: PeriodOption[] = [
  { id : "1w", label: "1주", add: {weeks:1} },
  { id : "2w", label: "2주", add: {weeks:2} },
  { id : "1m", label: "1개월", add: {months:1} },
  { id : "3m", label: "3개월", add: {months:3} },
  { id : "6m", label: "6개월", add: {months:6} },
  { id : "1y", label: "1년", add: {years:1} },
]

export const CUSTOM_PERIOD_ID = "custom";