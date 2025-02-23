"use client";

import { main, makeData, secondsFromPaceString } from "#src/lib/stuff";
import { useState } from "react";
import { Chart, Data } from "./compoents/chart";

/*
Array<
    [
      år: number,
      veckonummer: number,
      Kum_antal_avlidna: number,
      Kum_antal_fall: number,
      Kum_antal_intensivvårdade: number,
      Kum_fall_100000inv: number
    ]
  >


3:54 pace for 1.0km 	3min 45s
4:06 pace for 1.3km 	5min 18s
4:18 pace for 1.7km 	7min 30s
4:30 pace for 2.4km 	10min 36s
4:42 pace for 3.2km 	15min
4:54 pace for 4.3km 	21min 12s
5:06 pace for 5.9km 	30min
5:18 pace for 8.0km 	42min 25s
5:30 pace for 10.9km 	1h
5:42 pace for 14.9km 	1h 24min 51s
5:54 pace for 20.3km 	2h
6:06 pace for 27.8km 	2h 49min 42s
6:18 pace for 38.1km 	4h
6:30 pace for 52.2km 	5h 39min 24s
6:42 pace for 71.6km 	8h
6:54 pace for 98.4km 	11h 18min 49s
*/

const threshold_pace = secondsFromPaceString("5:30");
const threshold_time = 60 * 60;

export default function Home() {
  const [data, setData] = useState<Data>([
    [2000, 1, 1, 2, 3, 1],
    // [2000, 2, 1, 2, 3, 20],
    // [2000, 3, 1, 2, 3, 3],
    // [2000, 4, 1, 2, 3, 4],
    // [2000, 5, 1, 2, 3, 5],
    // [2000, 6, 1, 2, 3, 60],
    // [2000, 7, 1, 2, 3, 7],
    // [2000, 8, 1, 2, 3, 8],
    // [2000, 9, 1, 2, 3, 9],
    //[2011, 1, 1, 2, 3, 4],
    //[2012, 1, 1, 2, 3, 4],
  ]);
  return (
    <div className="container flex flex-col items-center px-2">
      <button
        onClick={() => {
          //main(threshold_pace, threshold_time);
          const items = makeData(threshold_pace, threshold_time);
          setData(
            items.map((item) => {
              return [item[0], 1, 0, 0, item[1], item[2]];
            })
          );
        }}
      >
        CLICK ME
      </button>
      <Chart data={data} />
    </div>
  );
}
