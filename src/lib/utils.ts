import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// 合并 Tailwind CSS 类名
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 格式化日期显示
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// 格式化距离显示
export function formatDistance(distance: number): string {
  return `${distance.toFixed(1)} 公里`;
}

// 格式化总距离显示
export function formatTotalDistance(distance: number): string {
  if (distance >= 1000) {
    return `${(distance / 1000).toFixed(1)}k 公里`;
  }
  return `${distance.toFixed(1)} 公里`;
}

// 获取排名显示文本
export function getRankText(rank: number): string {
  if (rank === 1) return '🥇 第1名';
  if (rank === 2) return '🥈 第2名';
  if (rank === 3) return '🥉 第3名';
  return `第${rank}名`;
}

// 验证日期格式
export function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

// 验证距离输入
export function isValidDistance(distance: string): boolean {
  const num = parseFloat(distance);
  return !isNaN(num) && num > 0 && num <= 100; // 最大100公里
}

// 获取今天的日期字符串
export function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

// 获取日期范围
export function getDateRange(days: number): { start: string; end: string } {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - days);
  
  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0]
  };
}

// 本地存储键名
export const STORAGE_KEYS = {
  CURRENT_USER: 'running_app_current_user',
  RUNNING_RECORDS: 'running_app_records',
} as const;

// 本地存储工具
export const storage = {
  get: <T>(key: string): T | null => {
    if (typeof window === 'undefined') return null;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },
  
  set: <T>(key: string, value: T): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // 忽略存储错误
    }
  },
  
  remove: (key: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
    } catch {
      // 忽略存储错误
    }
  }
};
