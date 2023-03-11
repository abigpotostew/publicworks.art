// @flow
import * as React from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { generatePrices } from "../../lib/dutch-auction/prices";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type Props = {
  startPrice: number;
  endPrice: number;
  startTime: Date;
  endTime: Date;
  declinePeriodSeconds: number;
  decay: number;
};

export const DutchAuctionChart = ({
  decay,
  declinePeriodSeconds,
  endPrice,
  endTime,
  startPrice,
  startTime,
}: Props) => {
  // const [data, setData] = useState< { time:Date;price:number }[]>([])
  const [data, setData] = useState<any>(null);
  const [options, setOptions] = useState<any>(null);

  useEffect(() => {
    //
    // f(x) = x / ((1 / b - 2) * (1 - x) + 1)
    const { prices, labels } = generatePrices({
      decay,
      declinePeriodSeconds,
      endPrice,
      endTime,
      startPrice,
      startTime,
    });

    const data = {
      labels,
      datasets: [
        {
          // label: 'Price At Time',
          data: prices.map((p) => p.price),
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
      ],
    };

    const opts2 = {
      scales: {
        y: {
          title: {
            display: true,
            text: "Price",
            font: {
              size: 15,
            },
          },
          ticks: {
            precision: 0,
          },
        },
        x: {
          title: {
            display: true,
            text: "Elapsed Time",
            font: {
              size: 15,
            },
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    };
    setOptions(opts2);
    setData(data);
  }, [startPrice, endPrice, startTime, endTime, declinePeriodSeconds, decay]);

  return (
    <div>
      {data && options && (
        <div /*style={{ width: 500, height: 700 }}*/>
          <Bar
            // style={{ width: 500, height: 700 }}
            className={"w-100"}
            options={options}
            data={data}
          />
        </div>
      )}
    </div>
  );
};
