import { format, formatDistanceToNow } from "date-fns";

export const formatAnnouncementTime = (date: string) => {
  return format(new Date(date), "MMM d, yyyy, h:mm a");
};

export const formatTimeAgo = (date: string) => {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
  });
};