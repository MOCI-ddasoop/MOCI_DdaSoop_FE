import { PeriodOption } from "@/shared/config/periodOptions";

export function calcPeriod(option:PeriodOption, baseDate = new Date()){
  const start = new Date(baseDate);
  const end = new Date(baseDate);

  const { weeks, months, years } = option.add;

  if(weeks) {
    end.setDate(end.getDate() + weeks * 7);
  }
  if(months){
    end.setMonth(end.getMonth() + months);
  }
  if(years){
    end.setFullYear(end.getFullYear() + years);
  }

  return { startDate: start, endDate: end };
}