"use client";

import {
  kmStringFromDist,
  makeData,
  pacestringFromSeconds,
  secondsFromPaceString,
  timestringFromSeconds,
} from "#src/lib/stuff";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { Input } from "./components/input";
import { Chart } from "./components/chart";

const zPaceString = z
  .custom<string>((x) => {
    try {
      const [a, b] = x.split(":");
      if (b.length !== 2) {
        return false;
      }
      const A = Number(a);
      const B = Number(b);
      if (isFinite(A) && isFinite(B) && B < 60) {
        return true;
      }

      return false;
    } catch {
      return false;
    }
  })
  .transform((x) => {
    const [a, b] = x.split(":");
    return 60 * Number(a) + Number(b);
  });

const threshold_time = 60 * 60;

type Data = ReturnType<typeof makeData>;

export function Table() {
  const [value, setValue] = useState("5:30");
  const [err, setErr] = useState<string | null>(null);

  const [data, setData] = useState<Data>(
    makeData(secondsFromPaceString("5:30"), threshold_time)
  );

  useEffect(() => {
    const parsed = zPaceString.safeParse(value);
    if (parsed.success) {
      const threshold_pace = parsed.data;
      const data = makeData(threshold_pace, threshold_time);
      setData(data);
      setErr(null);
    } else {
      setErr(parsed.error.errors.map((err) => err.message).join(" "));
    }
  }, [value]);

  return (
    <>
      <div className="w-96 mx-auto">
        <div className="py-4"></div>
        <h1 className="font-semibold text-xl italic">Run like the wind</h1>
        <div className="py-4"></div>

        <div className="">
          <div className="font-semibold">your threshold pace</div>
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            data-invalid={!!err}
            placeholder="5:30"
            className="w-auto"
          />
        </div>

        <div className="py-4"></div>
        <div className="font-semibold">your potenial, in numbers:</div>
        <div className="py-4"></div>

        <div className="grid grid-cols-3">
          <div className="font-bold">distance</div>
          <div className="font-bold">pace</div>
          <div className="font-bold">time</div>
          {data.fixedList.map((item, i) => (
            <React.Fragment key={i}>
              <div>{item.label}</div>
              <div>{pacestringFromSeconds(item.pace)} </div>
              <div>{timestringFromSeconds(item.time)}</div>
            </React.Fragment>
          ))}
          <div className="py-4"></div>
          <div className="py-4"></div>
          <div className="py-4"></div>

          {data.list.map((item, i) => (
            <React.Fragment key={i}>
              <div>{kmStringFromDist(item.dist)}</div>
              <div>{pacestringFromSeconds(item.pace)} </div>
              <div>{timestringFromSeconds(item.time)}</div>
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className="container mx-auto py-4">
        <div>Suggestions</div>
        {data.suggestions.map((item, i) => (
          <div key={i} className="mt-4">
            <div>{`${item.pace} pace for ${item.time} (${item.dist}).`}</div>
            <div className="pl-8">
              <span className="font-bold">{item.label}:</span>
              {item.reps
                ? `${item.reps} reps! Eech rep reflects ${item.intentity} of your potential (your PB would be holding that pace for ${item.pbTime}).`
                : `This reflects ${item.intentity} of your potential (your PB would be holding that pace for ${item.pbTime}).`}
            </div>
          </div>
        ))}
      </div>
      <div className="container mx-auto">
        <div>ISH VDOT Suggestions</div>
        {data.ish_vdot_suggestions.map((item, i) => (
          <div key={i} className="mt-4">
            <div>{`${item.pace} pace for ${item.time} (${item.dist}).`}</div>
            <div className="pl-8">
              <span className="font-bold">{item.label}:</span>
              {` This reflects ${item.intentity} of your potential (your PB would be holding that pace for ${item.pbTime}).`}
            </div>
          </div>
        ))}
      </div>
      <div className="container mx-auto">
        <Chart
          key={value}
          data={data.list.map((item) => ({
            x: item.pace,
            y: item.time,
            info: { hello: `${item.dist}` },
          }))}
        />
      </div>
    </>
  );
}
