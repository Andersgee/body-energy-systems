"use client";

import {
  kmStringFromDist,
  pacestringFromSeconds,
  timestringFromSeconds,
} from "#src/lib/stuff";
import * as d3 from "d3";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import useMeasure from "react-use-measure";

type Item = { x: number; y: number; info: { hello: string } };
type Data = Item[];

type Props = {
  data: Data;
};

export function Chart({ data }: Props) {
  const [ref, bounds] = useMeasure();

  return (
    <div className="relative mt-2 mb-4 aspect-21/9 w-full" ref={ref}>
      {bounds.width > 0 && (
        <ChartInner data={data} width={bounds.width} height={bounds.height} />
      )}
    </div>
  );
}

type ChartInnerProps = {
  data: Data;
  width: number;
  height: number;
};

function ChartInner({ data, width, height }: ChartInnerProps) {
  const margin = {
    top: 10,
    right: 10,
    bottom: 20,
    left: 45 * 2,
  };

  const yDomain = d3.extent(data.map((item) => item.y)) as [number, number];
  const xDomain = d3.extent(data.map((item) => item.x)) as [number, number];

  const yScale = d3
    .scaleLinear()
    .domain(yDomain)
    .range([height - margin.bottom, margin.top]);
  const xScale = d3
    .scaleLinear()
    .domain(xDomain)
    .range([margin.left, width - margin.right]);

  const yTicks = yScale.ticks(5);
  const xTicks = xScale.ticks(data.length / 2);

  const scaledData = data.map(
    (item) => [xScale(item.x), yScale(item.y)] as [number, number]
  );
  const lineGenerator = d3.line();
  const d = lineGenerator(scaledData)!;

  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const [hoveredItem, setHoveredItem] = useState<Data[number] | null>(null);

  const handleMouseMove = ({ clientX }: { clientX: number }) => {
    const svgElement = svgRef.current;
    const tooltipElement = tooltipRef.current;
    if (!svgElement || !tooltipElement) {
      return;
    }

    const bounds = svgElement.getBoundingClientRect();

    const plottedWidth = bounds.width - margin.left - margin.right;
    const mouseX = clientX - bounds.left - margin.left;

    const fractionX = mouseX / plottedWidth;

    let index = Math.round(fractionX * (data.length - 1));
    index = clamp(index, 0, data.length - 1);

    console.log({ fractionX, index });

    const y = yScale(data[index].y);
    const x = xScale(data[index].x);

    //clamp tooltip position
    const { width: tooltipWidth } = tooltipElement.getBoundingClientRect();
    const halfW = tooltipWidth * 0.5;
    const minX = halfW;
    const maxX = bounds.width - halfW;
    tooltipElement.style.top = `${Math.max(y, 0)}px`;
    tooltipElement.style.left = `${clamp(x, minX, maxX)}px`;

    setHoveredItem(data[index]);
  };

  return (
    <>
      <div
        ref={tooltipRef}
        className={
          hoveredItem === null
            ? "invisible"
            : "pointer-events-none absolute translate-x-[-50%] translate-y-[-105%] select-none rounded-sm bg-white p-2 text-black shadow-md w-44"
        }
      >
        {hoveredItem && (
          <div className="">
            <div>pace: {pacestringFromSeconds(hoveredItem.x)}</div>
            <div>time: {timestringFromSeconds(hoveredItem.y)}</div>
            <div>dist: {kmStringFromDist(+hoveredItem.info.hello)}</div>
          </div>
        )}
      </div>
      <svg
        ref={svgRef}
        onPointerMove={(e) => handleMouseMove({ clientX: e.clientX })}
        onTouchStart={(e) => handleMouseMove({ clientX: e.touches[0].clientX })}
        onTouchMove={(e) => handleMouseMove({ clientX: e.touches[0].clientX })}
        onPointerLeave={() => setHoveredItem(null)}
        onTouchCancel={() => setHoveredItem(null)}
        className="h-full w-full select-none overflow-x-hidden"
        viewBox={`0 0 ${width} ${height}`}
      >
        {xTicks.map((val, i) => {
          return (
            <g key={i} transform={`translate(${xScale(val)},0)`}>
              <text
                x={0}
                y={height}
                textAnchor="middle"
                fill="currentColor"
                className="text-md font-semibold text-neutral-600"
              >
                {pacestringFromSeconds(val)}
              </text>
            </g>
          );
        })}

        {yTicks.map((val, i) => {
          return (
            <g key={i} transform={`translate(0,${yScale(val)})`}>
              <line
                x1={margin.left}
                x2={width - margin.right}
                //y1={yScale(tick)}
                //y2={yScale(tick)}
                stroke="currentColor"
                strokeWidth={1}
                strokeDasharray="1,3"
                className="text-neutral-400 "
              />
              <text
                dominantBaseline="middle"
                textAnchor="end"
                x={margin.left - 5}
                //y={yScale(tick)}
                fill="currentColor"
                className="text-xs text-neutral-600"
              >
                {timestringFromSeconds(val)}
              </text>
            </g>
          );
        })}

        <motion.path
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          d={d}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="text-blue-500"
        />

        {hoveredItem && (
          <circle
            r="6"
            cx={xScale(hoveredItem.x)}
            cy={yScale(hoveredItem.y)}
            fill="currentColor"
            className="text-blue-400"
          />
        )}
      </svg>
    </>
  );
}

function clamp(x: number, a: number, b: number) {
  return Math.max(a, Math.min(x, b));
}
