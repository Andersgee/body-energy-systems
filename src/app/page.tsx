"use client";

import { useMemo, useState } from "react";
import { makeData } from "#src/lib/stuff";
import { Input } from "./components/input";
import { Chart } from "./components/chart";
import { CardTime } from "./card-time";
import { CardDist } from "./card-dist";
import { zIntensityString, zPaceString, zTimeString } from "../lib/validators";

const DEFAULT_THRESHOLD_TIME = 60 * 60;
const DEFAULT_THRESHOLD_PACE = "5:15";

const EXAMPLES = [
  { percent: 10, minutes: 45, label: "Easy" },
  { percent: 60, minutes: 45, label: "slightly below threshold" },
  { percent: 70, minutes: 30, label: "slightly above threshold" },
  { percent: 40, minutes: 120, label: "Long slow" },
  { percent: 80, minutes: 120, label: "Long hard" },
  { percent: 50, minutes: 180, label: "superlong" },
  { percent: 50, minutes: 9, label: "Intervals, 3 times ish" },
  { percent: 50, minutes: 3, label: "Intervals, 5 times ish" },
];

export default function Page() {
  const [value, setValue] = useState(DEFAULT_THRESHOLD_PACE);

  const data = useMemo(() => {
    try {
      const threshold_pace = zPaceString.parse(value);
      return makeData(threshold_pace, DEFAULT_THRESHOLD_TIME);
    } catch {
      return null;
    }
  }, [value]);

  return (
    <div>
      <div className="mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 pb-28">
        <div className="">
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="space-y-4">
                <div className="">
                  <div>Your threshold pace </div>
                  <div className="flex gap-1 items-baseline">
                    <Input
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      data-invalid={!!zPaceString.safeParse(value).error}
                      placeholder={DEFAULT_THRESHOLD_PACE}
                      className="w-auto"
                      autoFocus
                      //inputMode="numeric"
                    />
                    <div>min / km</div>
                  </div>
                </div>
                <div>
                  <h2 className="">Max effort equivalents</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <RaceEquivalents threshold_pace={value} />
                  </div>
                </div>
              </div>
            </div>
            <div className="">
              <h2 className="text-center">
                Max effort equivalents (any distance)
              </h2>
              <Chart
                key={value}
                data={
                  data?.map((item) => ({
                    x: item.pace,
                    y: item.time,
                    info: { dist: item.dist },
                  })) ?? []
                }
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="space-y-4">
            <div>
              <h2>Build your workout</h2>
              <CustomCardTime threshold_pace={value} />
            </div>
            <div>
              <h2>Some examples</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-fit">
                {EXAMPLES.map((x, i) => (
                  <CardTime
                    key={i}
                    description={x.label}
                    intensity={x.percent / 100}
                    time={x.minutes * 60}
                    threshold_pace={zPaceString.safeParse(value).data!}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="p-4 mx-auto max-w-screen-md">
        Note: adjust your threshold pace until the max effort equivalents looks
        reasonable to you personally. All values shown are based on that input
        field.
      </div>
    </div>
  );
}

function CustomCardTime({ threshold_pace }: { threshold_pace: string }) {
  const [timeString, setTime] = useState("45");
  const [intensityString, setIntensity] = useState("50");
  return (
    <>
      <div className="flex flex-wrap gap-4">
        <div className="w-64 h-32">
          <div>time in minutes</div>
          <Input
            value={timeString}
            onChange={(e) => setTime(e.target.value)}
            data-invalid={!!zTimeString.safeParse(timeString).error}
            placeholder="60"
            className="w-auto"
            inputMode="numeric"
          />
          <div>effort in percent</div>
          <Input
            value={intensityString}
            onChange={(e) => setIntensity(e.target.value)}
            data-invalid={!!zIntensityString.safeParse(intensityString).error}
            placeholder="10"
            className="w-auto"
            inputMode="numeric"
          />
        </div>
        <CardTime
          intensity={zIntensityString.safeParse(intensityString).data! / 100}
          time={zTimeString.safeParse(timeString).data! * 60}
          threshold_pace={zPaceString.safeParse(threshold_pace).data!}
        />
      </div>
    </>
  );
}

function RaceEquivalents({ threshold_pace }: { threshold_pace: string }) {
  return (
    <>
      <CardDist
        intensity={1}
        description="5k"
        dist={5}
        threshold_pace={zPaceString.safeParse(threshold_pace).data}
      />
      <CardDist
        intensity={1}
        description="10k"
        dist={10}
        threshold_pace={zPaceString.safeParse(threshold_pace).data}
      />
      <CardDist
        intensity={1}
        description="half marathon"
        dist={21.1}
        threshold_pace={zPaceString.safeParse(threshold_pace).data}
      />
      <CardDist
        intensity={1}
        description="marathon"
        dist={42.2}
        threshold_pace={zPaceString.safeParse(threshold_pace).data}
      />
    </>
  );
}
