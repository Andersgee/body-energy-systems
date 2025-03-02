const SPEED_DIFF_CONSTANT = 24;

//so a value of 12 apparently produces almost identical values as the jackdaniels vdot calculator
//const SPEED_DIFF_CONSTANT = 12;

export function secondsFromPaceString(str: string) {
  const [a, b] = str.split(":");
  return 60 * Number(a) + Number(b);
}

export function pacestringFromSeconds(x: number) {
  const r = Math.round(x);
  const minutes = Math.floor(r / 60);
  const seconds = Math.floor(r % 60);

  const secondsString = `${seconds}`.padStart(2, "0");
  return `${minutes}:${secondsString}`;
}

export function kmStringFromDist(dist: number) {
  return `${dist.toFixed(1)}km`;
}

export function timestringFromSeconds(s: number) {
  const hh_mm_ss = new Date(Math.round(s * 1000)).toISOString().slice(11, 19);
  const v = hh_mm_ss.split(":");
  const hh = Number(v[0]);
  const mm = Number(v[1]);
  const ss = Number(v[2]);

  const hours = "h";
  const minutes = "min";
  const seconds = "s";

  let str = "";
  if (hh > 0) {
    str = str.concat(`${hh}${hours}`);
  }
  if (mm > 0) {
    if (hh > 0) {
      str = str.concat(` ${mm}${minutes}`);
    } else {
      str = str.concat(`${mm}${minutes}`);
    }
  }

  if (ss > 0) {
    str = str.concat(` ${ss}${seconds}`);
  }

  return str;
}

/**
 * ```raw
 * 48 sec slower pace => sustainable for 4x longer time
 *
 * 48 => 4
 * 24 => 2
 * 0 => 1
 * -24 => 0.5
 * -48 => 0.25
 * ```
 */
function scaleFromPaceDiff(pace_diff: number, k = SPEED_DIFF_CONSTANT) {
  return Math.pow(2, pace_diff / k);
}

/**
 * ```raw
 * 4x longer time => sustanable at 48 sec slower pace
 *
 * 4 => 48
 * 2 => 24
 * 1 => 0
 * 0.5 => -24
 * 0.25 => -48
 * ```
 */
function paceDiffFromScale(scale: number, k = SPEED_DIFF_CONSTANT) {
  return Math.log2(scale) * k;
}

function timeDistFromPace(
  pace: number,
  threshold_pace: number,
  threshold_time: number
) {
  const k = scaleFromPaceDiff(pace - threshold_pace);
  const time = k * threshold_time;
  const dist = time / pace;
  return { time, dist };
}

function timePaceFromDist(
  target_dist: number,
  threshold_pace: number,
  threshold_time: number
) {
  //dont think theres an analytical way to do this
  //the only thing I have equation for is mapping between time and pace
  //the distance itself requires both those things

  const SLOWEST_EXAMINED_PACE = secondsFromPaceString("60:00");

  let prev_time = 0;
  let prev_pace = 0;
  for (let pace = SLOWEST_EXAMINED_PACE; pace > 0; pace = pace - 0.1) {
    const { time: max_sustainable_time, dist: max_sustainable_dist } =
      timeDistFromPace(pace, threshold_pace, threshold_time);

    if (max_sustainable_dist <= target_dist) {
      //this is the point where we can no longer sustain examined pace for whole target_dist
      return { time: prev_time, pace: prev_pace };
    }
    prev_time = max_sustainable_time;
    prev_pace = pace;
  }

  return { time: prev_time, pace: prev_pace };
}

function paceDistFromTime(
  time: number,
  threshold_pace: number,
  threshold_time: number
) {
  const pace = threshold_pace + paceDiffFromScale(time / threshold_time);
  const { dist } = timeDistFromPace(pace, threshold_pace, threshold_time);
  return { pace, dist };
}

export function cardDistCalc(
  dist: number,
  threshold_pace: number,
  threshold_time: number
) {
  const { pace, time } = timePaceFromDist(dist, threshold_pace, threshold_time);

  return {
    pace: pacestringFromSeconds(pace),
    time: timestringFromSeconds(time),
    dist: kmStringFromDist(dist),
    //maxTimeAtPace: timestringFromSeconds(pbTime),
    //maxDistAtPace: kmStringFromDist(pbDist),
  };
}

export function cardTimeCalc(
  time: number,
  intensity: number,
  threshold_pace: number,
  threshold_time: number
) {
  const pbTime = time / intensity;
  const { pace, dist: pbDist } = paceDistFromTime(
    pbTime,
    threshold_pace,
    threshold_time
  );
  const dist = time / pace;

  return {
    pace: pacestringFromSeconds(pace),
    time: timestringFromSeconds(time),
    dist: kmStringFromDist(dist),
    maxTimeAtPace: timestringFromSeconds(pbTime),
    maxDistAtPace: kmStringFromDist(pbDist),
  };
}

export function valuesFromTimeIntensity(
  time: number,
  /** 0..1 */
  intensity: number,
  threshold_pace: number,
  threshold_time: number
) {
  const pbTime = time / intensity;
  const { pace } = paceDistFromTime(pbTime, threshold_pace, threshold_time);
  const dist = time / pace;

  return {
    dist: kmStringFromDist(dist),
    pace: pacestringFromSeconds(pace),
    time: timestringFromSeconds(time),
    intentity: `${intensity * 100}%`,
    pbTime: timestringFromSeconds(pbTime),
    description: `${pacestringFromSeconds(pace)} for ${timestringFromSeconds(
      time
    )} (${kmStringFromDist(
      dist
    )}). You could in fact hold that pace for ${timestringFromSeconds(pbTime)}`,
  };
}

type Item = { pace: number; time: number; dist: number };
export function makeData(threshold_pace: number, threshold_time = 3600) {
  const r: Item[] = [];
  const v = Array.from({ length: 64 * 2 * 2 }, (_, i) => i);
  for (const i of v) {
    const diff = i - v.length * 0.5;
    const pace = threshold_pace + diff; // seconds / km

    const { time, dist } = timeDistFromPace(
      pace,
      threshold_pace,
      threshold_time
    );
    r.push({ pace, time, dist });
  }
  return r;
}
