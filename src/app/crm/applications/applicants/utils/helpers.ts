import { ADToBS } from 'bikram-sambat-js';

export function getLocalToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function formatADDate(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function getTodayBS(): string {
  return ADToBS(formatADDate(getLocalToday()));
}

export function getBSDateDaysAgo(daysAgo: number): string {
  const d = getLocalToday();
  d.setDate(d.getDate() - daysAgo);
  return ADToBS(formatADDate(d));
}

export function getFirstDayOfCurrentBSMonth(): string {
  const bsToday = getTodayBS();
  const [year, month] = bsToday.split('-');
  return `${year}-${month}-01`;
}

export function getFirstDayOfCurrentBSYear(): string {
  const bsToday = getTodayBS();
  const [year] = bsToday.split('-');
  return `${year}-01-01`;
}

export const getStatusStyle = (isActive: boolean) => {
  return isActive
    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
};