export type Props = {
  startPrice: number;
  endPrice: number;
  startTime: Date;
  endTime: Date;
  declinePeriodSeconds: number;
  decay: number;
};

export const generatePrices = ({
  decay,
  declinePeriodSeconds,
  endPrice,
  endTime,
  startPrice,
  startTime,
}: Props) => {
  const start = Math.round(startTime.getTime() / 1000);
  const end = Math.round(endTime.getTime() / 1000);
  const duration = end - start;
  const priceDiff = startPrice - endPrice;
  const prices: { time: Date; price: number }[] = [];
  for (let i = 0; i <= duration; i += declinePeriodSeconds) {
    const t = i / duration;
    const v = Math.round(
      (1 - t / ((1 / decay - 2) * (1 - t) + 1)) * priceDiff + endPrice
    );
    prices.push({
      price: parseFloat(v.toFixed(2)),
      time: new Date((start + i) * 1000),
    });
  }
  const hoursSinceElapsed = (t: Date) =>
    Math.floor((Math.round(t.getTime() / 1000) - start) / (60 * 60))
      .toFixed(0)
      .padStart(2, "0");
  const minutesSinceElapsed = (t: Date) =>
    Math.round((Math.round(t.getTime() / 1000) - start) / 60) % 60;
  const labels = prices.map(
    (p) =>
      hoursSinceElapsed(p.time) +
      ":" +
      minutesSinceElapsed(p.time).toFixed(0).padStart(2, "0") +
      ""
  );
  return { prices, labels };
};
