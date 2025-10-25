export type Props = {
  startPrice: number;
  endPrice: number;
  startTime: Date;
  endTime: Date;
  declinePeriodSeconds: number;
  decay: number;
  omitPrices?: boolean;
};

export type DutchAuctionPrices = {
  prices: { time: Date; price: number }[];
  labels: string[];
  pricesOmitted: boolean;
};

export const generatePricesSchlick = ({
  decay,
  declinePeriodSeconds,
  endPrice,
  endTime,
  startPrice,
  startTime,
  omitPrices = false,
}: Props): DutchAuctionPrices => {
  const start = Math.round(startTime.getTime() / 1000);
  const end = Math.round(endTime.getTime() / 1000);
  const duration = end - start;
  const priceDiff = startPrice - endPrice;
  const prices: { time: Date; price: number }[] = [];
  const numPrices = Math.floor(duration / declinePeriodSeconds);
  let step = declinePeriodSeconds;
  // console.log("numPrices", numPrices, startTime, endTime);
  if (omitPrices && numPrices > 300) {
    step = Math.floor(step * Math.floor(numPrices / 50));
  }

  for (let i = 0; i <= duration; i += step) {
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
    Math.floor((Math.round(t.getTime() / 1000) - start) / (60 * 60));
  const minutesSinceElapsed = (t: Date) =>
    Math.round((Math.round(t.getTime() / 1000) - start) / 60) % 60;
  const labels = prices.map((p) => {
    const hours = hoursSinceElapsed(p.time);
    return (
      `${hours > 0 ? hours + "h" : ""}` + minutesSinceElapsed(p.time) + "m"
    );
  });
  return { prices, labels, pricesOmitted: step !== declinePeriodSeconds };
};

export const generatePricesHalfLife = ({
  decay,
  declinePeriodSeconds,
  endPrice,
  endTime,
  startPrice,
  startTime,
  omitPrices = false,
}: Props): DutchAuctionPrices => {
  const start = Math.round(startTime.getTime() / 1000);
  const end = Math.round(endTime.getTime() / 1000);
  const priceDiff = startPrice - endPrice;
  const duration = end - start;
  //https://github.com/ArtBlocks/artblocks-contracts/blob/107de53aa8b059c7cceb329ba1b402d9cb186f54/packages/contracts/contracts/libs/v0.8.x/minter-libs/DAExpLib.sol#L194
  //    // Perform a linear interpolation between partial half-life points, to
  //         // approximate the current place on a perfect exponential decay curve.
  //         unchecked {
  //             // value of expression is provably always less than decayedPrice,
  //             // so no underflow is possible when the subtraction assignment
  //             // operator is used on decayedPrice.
  //             decayedPrice -=
  //                 ((decayedPrice *
  //                     (elapsedTimeSeconds % priceDecayHalfLifeSeconds)) /
  //                     priceDecayHalfLifeSeconds) >>
  //                 1; // divide by 2 via bitshift 1
  //         }

  const prices: { time: Date; price: number }[] = [];
  const numPrices = Math.floor(duration / declinePeriodSeconds);
  let step = declinePeriodSeconds;
  if (omitPrices && numPrices > 300) {
    step = Math.floor(step * Math.floor(numPrices / 50));
  }

  for (let i = 0; i <= duration; i += step) {
    let decayedPrice = startPrice;
    decayedPrice >>= Math.floor(i / step); //duration / declinePeriodSeconds;
    if (decayedPrice < endPrice) {
      decayedPrice = endPrice;
    }
    // const t = i / duration;
    // const v = Math.round(
    //   (1 - t / ((1 / decay - 2) * (1 - t) + 1)) * priceDiff + endPrice
    // );
    prices.push({
      price: parseFloat(decayedPrice.toFixed(2)),
      time: new Date((start + i) * 1000),
    });
  }
  const hoursSinceElapsed = (t: Date) =>
    Math.floor((Math.round(t.getTime() / 1000) - start) / (60 * 60));
  const minutesSinceElapsed = (t: Date) =>
    Math.round((Math.round(t.getTime() / 1000) - start) / 60) % 60;
  const labels = prices.map((p) => {
    const hours = hoursSinceElapsed(p.time);
    return (
      `${hours > 0 ? hours + "h" : ""}` + minutesSinceElapsed(p.time) + "m"
    );
  });
  return { prices, labels, pricesOmitted: step !== declinePeriodSeconds };
};
export const generatePrices = generatePricesSchlick;
