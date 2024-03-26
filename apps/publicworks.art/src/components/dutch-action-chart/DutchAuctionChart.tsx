// @flow
import * as React from "react";
import "chartjs-adapter-date-fns";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  Legend,
  LinearScale,
  Title,
  Tooltip,
  LineElement,
  PointElement,
  TimeSeriesScale,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  DutchAuctionPrices,
  generatePrices,
} from "../../lib/dutch-auction/prices";
import { Alert } from "react-bootstrap";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  TimeSeriesScale
  // ChartDataLabels
);

type Props = {
  startPrice: number;
  endPrice: number;
  startTime: Date;
  endTime: Date;
  declinePeriodSeconds: number;
  decay: number;
  chartData?: (res: DutchAuctionPrices) => void;
};

export const DutchAuctionChart = ({
  decay,
  declinePeriodSeconds,
  endPrice,
  endTime,
  startPrice,
  startTime,
  chartData,
}: Props) => {
  // const [data, setData] = useState< { time:Date;price:number }[]>([])
  const [data, setData] = useState<any>(null);
  const [options, setOptions] = useState<any>(null);

  useEffect(() => {
    // f(x) = x / ((1 / b - 2) * (1 - x) + 1)
    const { prices, labels, pricesOmitted } = generatePrices({
      decay,
      declinePeriodSeconds,
      endPrice,
      endTime,
      startPrice,
      startTime,
      omitPrices: true,
    });

    const data = {
      labels: prices.map((p, i) => p.time),
      datasets: [
        {
          // label: 'Price At Time',
          data: prices.map((p, i) => p.price),
          backgroundColor: "rgba(103,68,131,0.5)",
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
          type: "time",
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
        datalabels: {
          display: prices.length <= 40,
          anchor: "end",
          align: "top",
          formatter: Math.round,
          font: {
            // weight: "bold",
          },
        },
      },
    };
    setOptions(opts2);
    setData(data);
    chartData && chartData({ prices, labels, pricesOmitted });
  }, [
    startPrice,
    endPrice,
    startTime,
    endTime,
    declinePeriodSeconds,
    decay,
    chartData,
  ]);

  if (endTime.getTime() < new Date().getTime() || endTime < startTime) {
    return (
      <div>
        <Alert variant={"danger"}>End time must be in the future</Alert>
      </div>
    );
  }

  return (
    <div>
      {data && options && (
        <div /*style={{ width: 500, height: 700 }}*/>
          <Bar
            // style={{ width: 500, height: 700 }}
            className={"w-100"}
            options={options}
            data={data}
            plugins={[ChartDataLabels]}
          />
        </div>
      )}
    </div>
  );
};
