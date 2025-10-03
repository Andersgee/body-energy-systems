"use client";

import { Input } from "../components/input";
import { Fragment, useMemo, useState } from "react";
import { z } from "zod";
import { cn } from "#src/utils/cn";

const LANES: { number: number; meters: number }[] = [
  { number: 1, meters: 400.0 },
  { number: 2, meters: 407.7 },
  { number: 3, meters: 415.3 },
  { number: 4, meters: 423.0 },
  { number: 5, meters: 430.7 },
  { number: 6, meters: 438.3 },
  { number: 7, meters: 446.0 },
  { number: 8, meters: 453.7 },
];

export const zDistanceString = z
  .custom<string>((x) => {
    try {
      const n = Number(x);

      if (isFinite(n)) {
        return true;
      }

      return false;
    } catch {
      return false;
    }
  })
  .transform((x) => {
    return Number(x);
  });

const DEFAULT_DISTANCE = "7000";

function lapsFromMeters(meters: number) {
  return LANES.map((lane) => {
    const laps = meters / lane.meters;
    const low_laps = Math.floor(laps);
    const high_laps = Math.ceil(laps);

    return {
      ...lane,
      laps,
      exact: meters,
      low: { laps: low_laps, meters: low_laps * lane.meters },
      high: { laps: high_laps, meters: high_laps * lane.meters },
    };
  });
}

function minDiff(desired: number, items: number[]) {
  let min = Infinity;
  let minIndex = 0;
  for (let i = 0; i < items.length; i++) {
    const diff = Math.abs(desired - items[i]);
    if (diff < min) {
      min = diff;
      minIndex = i;
    }
  }
  return { min, minIndex };
}

export default function Page() {
  const [value, setValue] = useState(DEFAULT_DISTANCE);
  const data = useMemo(() => {
    try {
      const x = zDistanceString.parse(value);
      const l = lapsFromMeters(x);
      const lowMindiffIndex = minDiff(
        x,
        l.map((x) => x.low.meters)
      ).minIndex;
      const highMindiffIndex = minDiff(
        x,
        l.map((x) => x.high.meters)
      ).minIndex;
      return {
        l,
        lowMindiffIndex,
        highMindiffIndex,
      };
    } catch {
      return null;
    }
  }, [value]);

  return (
    <div className="space-y-4 mx-4 my-4">
      <h1 className="text-balance">
        Calculate number of laps required for distance
      </h1>
      <div className="flex gap-1 items-baseline">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          data-invalid={!!zDistanceString.safeParse(value).error}
          placeholder={DEFAULT_DISTANCE}
          className="w-auto"
          autoFocus
          inputMode="numeric"
        />
        <div>meters</div>
      </div>
      <div className="grid grid-cols-[50px_200px_200px]">
        <div>Lane</div>
        <div>Laps (rounded down)</div>
        <div>Laps (rounded up)</div>
        {data?.l.map((lane, i) => (
          <Fragment key={lane.number}>
            <div>{`${lane.number}`}</div>
            <div className={cn(i === data.lowMindiffIndex && "font-bold")}>{`${
              lane.low.laps
            } (${lane.low.meters.toFixed(0)}m)`}</div>
            <div className={cn(i === data.highMindiffIndex && "font-bold")}>{`${
              lane.high.laps
            } (${lane.high.meters.toFixed(0)}m)`}</div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
