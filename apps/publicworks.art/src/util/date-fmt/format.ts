// export function timeDifference(current: Date, previous: Date) {
//   const msPerMinute = 60 * 1000;
//   const msPerHour = msPerMinute * 60;
//   const msPerDay = msPerHour * 24;
//   const msPerMonth = msPerDay * 30;
//   const msPerYear = msPerDay * 365;
//
//   const elapsed = current.getTime() - previous.getTime();
//
//   if (elapsed < msPerMinute) {
//     return Math.round(elapsed / 1000) + " seconds ago";
//   } else if (elapsed < msPerHour) {
//     return Math.round(elapsed / msPerMinute) + " minutes ago";
//   } else if (elapsed < msPerDay) {
//     return Math.round(elapsed / msPerHour) + " hours ago";
//   } else if (elapsed < msPerMonth) {
//     return Math.round(elapsed / msPerDay) + " days ago";
//   } else if (elapsed < msPerYear) {
//     return "over " + Math.round(elapsed / msPerMonth) + " months ago";
//   } else {
//     return "" + Math.round(elapsed / msPerYear) + " years ago";
//   }
//   Intl.RelativeTimeFormat();
// }

const units: { unit: Intl.RelativeTimeFormatUnit; ms: number }[] = [
  { unit: "year", ms: 31536000000 },
  { unit: "month", ms: 2628000000 },
  { unit: "day", ms: 86400000 },
  { unit: "hour", ms: 3600000 },
  { unit: "minute", ms: 60000 },
  { unit: "second", ms: 1000 },
];
const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

/**
 * Get language-sensitive relative time message from Dates.
 * @param relative  - the relative dateTime, generally is in the past or future
 * @param pivot     - the dateTime of reference, generally is the current time
 */
export function relativeTimeFromDates(
  relative: Date | null,
  pivot: Date = new Date()
): string {
  if (!relative) return "";
  const elapsed = relative.getTime() - pivot.getTime();
  return relativeTimeFromElapsed(elapsed);
}

/**
 * Get language-sensitive relative time message from elapsed time.
 * @param elapsed   - the elapsed time in milliseconds
 */
export function relativeTimeFromElapsed(elapsed: number): string {
  for (const { unit, ms } of units) {
    if (Math.abs(elapsed) >= ms || unit === "second") {
      return rtf.format(Math.round(elapsed / ms), unit);
    }
  }
  return "";
}
