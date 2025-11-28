/**
 * @description 배열을 주어진 키로 그룹화하는 함수
 * @param array 그룹화할 배열
 * @param key 그룹화할 키
 * @returns 그룹화된 객체
 */

export const groupById = <
  T extends Record<string, string | number>, 
  K extends string | number = string
>(
  array: T[], 
  key?: keyof T
): Record<K, T[]> => {
  const lookup = {} as Record<K, T[]>;

  for (const item of array) {
    const groupKey = (key ? item[key] : item.id) as K;

    if (!lookup[groupKey]) {
      lookup[groupKey] = [];
    }
    
    lookup[groupKey].push(item);
  }

  return lookup;
};