// format a date
import { Timestamp } from "google-protobuf/google/protobuf/timestamp_pb";

import { dayMillis } from "./timeAgo";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const dateTimeFormatter = new Intl.DateTimeFormat(navigator.language, {
  month: "short",
  year: "numeric",
});

const dateFormatter = new Intl.DateTimeFormat(navigator.language, {
  year: "numeric",
  month: "short",
  day: "2-digit",
});

const numNights = (date1: string, date2: string): string => {
  const diffTime = Date.parse(date1) - Date.parse(date2);
  const diffDays = Math.ceil(diffTime / dayMillis);
  return diffDays === 1 ? `${diffDays} night` : `${diffDays} nights`;
};

function formatDate(s: string, short: boolean = false): string {
  const monthName = monthNames[Number.parseInt(s.split("-")[1]) - 1];
  if (short) return `${s.split("-")[2]} ${monthName}`;
  return `${s.split("-")[2]} ${monthName.substr(0, 3)} ${s.split("-")[0]}`;
}

function timestamp2Date(timestamp: Timestamp.AsObject): Date {
  return new Date(Math.floor(timestamp.seconds * 1e3 + timestamp.nanos / 1e6));
}

function isSameDate(date1: Date, date2: Date): boolean {
  return (
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear() &&
    date1.getDate() === date2.getDate()
  );
}

/** Compares whether date1 is equal to or in the future of date2 */
function isSameOrFutureDate(date1: Date, date2: Date): boolean {
  return (
    isSameDate(date1, date2) ||
    date1.setHours(0, 0, 0, 0) > date2.setHours(0, 0, 0, 0)
  );
}

export {
  dateFormatter,
  dateTimeFormatter,
  formatDate,
  isSameOrFutureDate,
  numNights,
  timestamp2Date,
};
