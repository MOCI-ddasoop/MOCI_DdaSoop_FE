/**
 * @description 배열을 주어진 키로 그룹화하는 함수
 * @param array 그룹화할 객체
 * @param key 그룹화할 키
 * @returns 그룹화된 객체
 */

export const groupById = <T, K extends string | number = string>(
  array: T[],
  key?: keyof T
): Record<K, T[]> => {
  const lookup = {} as Record<K, T[]>;

  for (const item of array) {
    const groupKey = (key ? item[key] : (item as { id: string }).id) as K;
    
    if (!groupKey && groupKey !== 0) continue;
    
    if (!lookup[groupKey]) {
      lookup[groupKey] = [];
    }

    lookup[groupKey].push(item);
  }

  return lookup;
};

/**
 * @description 그룹화된 객체와 배열을 주어진 키로 그룹화하는 함수
 * @param lookup 그룹화된 객체
 * @param array 그룹화할 배열
 * @param key 그룹화할 키
 * @returns 그룹화된 객체와 배열을 주어진 키로 그룹화한 객체
 */

export const combineById = <
  T extends Record<string, string | number>,
  K extends string | number = string
>(
  lookup: Record<K, T[]>,
  array: T[],
  key?: keyof T
): Record<K, T[]> => {
  return Object.assign(lookup, groupById(array, key));
};
