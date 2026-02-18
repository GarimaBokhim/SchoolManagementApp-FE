export const STATUS_COLORS = {
  new: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  contacted: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  qualified: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  lost: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  default: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
} as const;

export const FILTER_OPTIONS = [
  { label: 'Yesterday', value: 'Yesterday' },
  { label: '7 Days', value: '7 Days' },
  { label: '30 Days', value: '30 Days' },
  { label: 'This Month', value: 'This Month' },
  { label: 'Last Month', value: 'Last Month' },
  { label: 'This Year', value: 'This Year' }
] as const;