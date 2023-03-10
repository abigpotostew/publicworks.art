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
    // setData(prices)
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
    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom" as const,
        },
        title: {
          display: true,
          text: "Dutch Auction",
        },
      },
      scales: {
        xAxes: [
          {
            ticks: {
              major: {
                fontStyle: "bold",
                fontColor: "#FF0000",
              },
            },
            scaleLabel: {
              display: true,
              labelString: "probability",
            },
          },
        ],
        yAxes: [
          {
            display: true,
            scaleLabel: {
              display: true,
              labelString: "Price",
            },
          },
        ],
      },
      // scales: {
      // x: {
      //     ticks: {
      //         callback: function(label:any) {
      //             return `\$${this.getLabelForValue(label)}`
      //         }
      //     }
      // },
      // x:{
      //       axis: 'x',
      //       labels: ['Elapsed Time'],
      //       grid: {
      //           drawOnChartArea: false
      //       }
      // }
      // secondXAxis: {
      //     axis: 'x',
      //   // position: 'bottom' ,
      //   //   title: 'Elapsed Time',
      //   // labels: ['Elapsed Time'],
      //   // display:true,
      //   scaleLabel: {
      //     display: true,
      //     labelString: 'probability'
      //   },
      //     // grid: {
      //     //     drawOnChartArea: false
      //     // }
      // }

      // }
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
