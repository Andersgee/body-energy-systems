import { cardDistCalc } from "#src/lib/stuff";

type Props = {
  description?: string;
  dist?: number;
  intensity?: number;
  threshold_pace?: number;
  threshold_time?: number;
};

export function CardDist({
  description,
  dist,
  intensity,
  threshold_pace,
  threshold_time = 3600,
}: Props) {
  if (!dist || !intensity || !threshold_pace || !threshold_time) {
    return <div className="p-2 shadow-lg w-64 h-32"></div>;
  }
  const item = cardDistCalc(dist, threshold_pace, threshold_time);

  return (
    <div className="p-2 shadow-lg w-64 h-32">
      {description ? <div className="">{description}</div> : null}
      <div className="font-bold">{`${item.pace} pace for ${item.time} (${item.dist}).`}</div>
    </div>
  );
}
