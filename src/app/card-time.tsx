import { cardTimeCalc } from "#src/lib/stuff";

type Props = {
  description?: string;
  time?: number;
  intensity?: number;
  threshold_pace?: number;
  threshold_time?: number;
};

export function CardTime({
  description,
  time,
  intensity,
  threshold_pace,
  threshold_time = 3600,
}: Props) {
  if (!time || !intensity || !threshold_pace || !threshold_time) {
    return <div className="p-2 shadow-lg w-64 h-32"></div>;
  }
  const item = cardTimeCalc(time, intensity, threshold_pace, threshold_time);

  return (
    <div className="p-2 shadow-lg w-64 h-32">
      {description ? <div className="">{description}</div> : null}
      <div className="font-semibold">{`${item.pace} pace for ${item.time} (${item.dist}).`}</div>
      <div className="text-neutral-600">{`Reflects ${
        intensity * 100
      }% of max effort since you could hold that pace for ${
        item.maxTimeAtPace
      } (${item.maxDistAtPace}).`}</div>
    </div>
  );
}
