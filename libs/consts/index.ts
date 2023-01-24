const MINUTE = 60;
export const HOUR = 60 * MINUTE;

export const DAY = 60 * HOUR;

export const WEEK = 7 * DAY;

export const MONTH = 30 * DAY;

export const YEAR = 365 * DAY;

// as const를 통해 개별 속성도 상수로 적용
// 객체 자체에 대해 readonly
export const EXPIRATION = {
  ACCESS_TOKEN: 600,
  REFRESH_TOKEN: 1296000,
} as const;
