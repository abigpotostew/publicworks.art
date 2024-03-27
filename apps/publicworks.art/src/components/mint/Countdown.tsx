import { fromTimestamp } from "cosmjs-types/helpers";
import Countdown from "react-countdown";

const valueSuffix = (value: number, fmtValue: string, suffix: string) => {
  if (value > 1) {
    return `${fmtValue} ${suffix}s`;
  } else if (value === 1) {
    return `${fmtValue} ${suffix}`;
  } else return "";
};
export const CountdownSale = ({ date }: { date: Date }) => {
  return (
    <Countdown
      date={date}
      key={date.toISOString()}
      zeroPadDays={0}
      zeroPadTime={0}
      renderer={({
        formatted: {
          days: daysFmt,
          hours: hoursFmt,
          minutes: minutesFmt,
          seconds: secondsFmt,
        },
        days,
        hours,
        minutes,
        seconds,
      }) => (
        <span>{`${valueSuffix(days, daysFmt, "day")} ${valueSuffix(
          hours,
          hoursFmt,
          "hour"
        )} ${valueSuffix(minutes, minutesFmt, "minute")} ${valueSuffix(
          seconds,
          secondsFmt,
          "second"
        )}`}</span>
      )}
    />
  );
};
