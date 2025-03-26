import {
  format,
  formatDistanceToNow,
  isToday,
  isYesterday,
  parseISO,
  differenceInMinutes,
} from "date-fns";

export function formatDate(dateString: string) {
  const date = parseISO(dateString);
  const now = new Date();
  const diffInMinutes = differenceInMinutes(now, date);

  if (diffInMinutes < 60) {
    return formatDistanceToNow(date, { addSuffix: true }); // "5 minutes ago"
  }

  if (isToday(date)) {
    return `Today at ${format(date, "h a")}`; // "Today at 2 PM"
  }

  if (isYesterday(date)) {
    return `Yesterday at ${format(date, "h a")}`; // "Yesterday at 2 PM"
  }

  return format(date, "d MMMM yyyy 'at' h a"); // "14 April 2025 at 2 PM"
}
