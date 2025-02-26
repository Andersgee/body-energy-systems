//so a value of 12 apparently produces almost identical values as the jackdaniels vdot calculator
//const SPEED_DIFF_CONSTANT = 12;

//but my times fit better with 24
const SPEED_DIFF_CONSTANT = 24;

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

function log_equivalent_by_dist(
  label: string,
  dist: number,
  threshold_pace: number,
  threshold_time: number
) {
  const { time, pace } = timePaceFromDist(dist, threshold_pace, threshold_time);

  const paceSring = pacestringFromSeconds(pace);
  const timeString = timestringFromSeconds(time);
  console.log(`${paceSring} pace for ${label} \t ${timeString}`);
}

function log_equivalent_by_pace(
  pace: number,
  threshold_pace: number,
  threshold_time: number
) {
  const { time, dist } = timeDistFromPace(pace, threshold_pace, threshold_time);

  const pacestring = pacestringFromSeconds(pace);
  const timeString = timestringFromSeconds(time);
  console.log(`${pacestring} pace for ${dist.toFixed(1)}km \t${timeString}`);
}

export function main(threshold_pace: number, threshold_time = 3600) {
  const input_string = `INPUT THRESHOLD PACE: ${pacestringFromSeconds(
    threshold_pace
  )} / km`;
  const line = Array.from({ length: input_string.length }).fill("-").join("");
  console.log(line);
  console.log(input_string);
  console.log(line);

  console.log(`\you should be able to run at\n`);

  log_equivalent_by_dist("5k", 5, threshold_pace, threshold_time);
  log_equivalent_by_dist("10k", 10, threshold_pace, threshold_time);
  log_equivalent_by_dist("halfmara", 21.0975, threshold_pace, threshold_time);
  log_equivalent_by_dist("marathon", 42.195, threshold_pace, threshold_time);

  console.log("\nThese are some other paces you could hold:\n");

  const v = Array.from({ length: 16 }, (_, i) => i - 8);
  for (const i of v) {
    const s = i * 12;
    const pace = threshold_pace + s; // seconds / km
    log_equivalent_by_pace(pace, threshold_pace, threshold_time);
  }
}

function maxPotentialByDist(
  label: string,
  dist: number,
  threshold_pace: number,
  threshold_time: number
) {
  const { pace, time } = timePaceFromDist(dist, threshold_pace, threshold_time);
  return { label, dist, pace, time };
}

function workoutSuggestionByTime(
  label: string,
  time: number,
  /** 0..1 */
  intensity: number,
  threshold_pace: number,
  threshold_time: number,
  reps = 0
) {
  const pbTime = time / intensity;
  //you could hold this pace for
  const { pace } = paceDistFromTime(pbTime, threshold_pace, threshold_time);
  const dist = time / pace;

  return {
    label,
    dist: kmStringFromDist(dist),
    pace: pacestringFromSeconds(pace),
    time: timestringFromSeconds(time),
    intentity: `${intensity * 100}%`,
    pbTime: timestringFromSeconds(pbTime),
    reps,
  };
}

type Item = { pace: number; time: number; dist: number };
export function makeData(threshold_pace: number, threshold_time = 3600) {
  const r: Item[] = [];
  const v = Array.from({ length: 16 }, (_, i) => i - 8);
  for (const i of v) {
    const s = i * (0.5 * SPEED_DIFF_CONSTANT);
    const pace = threshold_pace + s; // seconds / km
    //log_equivalent_by_pace(pace, threshold_pace, threshold_time);
    const { time, dist } = timeDistFromPace(
      pace,
      threshold_pace,
      threshold_time
    );
    r.push({ pace, time, dist });
  }

  const fixedList = [
    maxPotentialByDist("5k", 5, threshold_pace, threshold_time),
    maxPotentialByDist("10k", 10, threshold_pace, threshold_time),
    maxPotentialByDist("halfmara", 21.0975, threshold_pace, threshold_time),
    maxPotentialByDist("marathon", 42.195, threshold_pace, threshold_time),
  ];

  const ish_vdot_suggestions = [
    workoutSuggestionByTime(
      "Easy",
      60 * 45,
      0.1,
      threshold_pace,
      threshold_time
    ),
    workoutSuggestionByTime(
      "Marathon",
      60 * 90,
      0.7,
      threshold_pace,
      threshold_time
    ),
    workoutSuggestionByTime(
      "Threshold",
      60 * 20,
      0.35,
      threshold_pace,
      threshold_time
    ),
    workoutSuggestionByTime(
      "Interval (5x3min = 15 min totalt, 2 min vila mellan)",
      60 * 15,
      0.6,
      threshold_pace,
      threshold_time
    ),

    workoutSuggestionByTime(
      "Repetition (4x1min = 4 min totalt, 1 min vila mellan)",
      60 * 4,
      0.6,
      threshold_pace,
      threshold_time
    ),
  ];

  const suggestions = [
    workoutSuggestionByTime(
      "VO2max",
      60 * 3,
      0.8,
      threshold_pace,
      threshold_time,
      3
    ),
    workoutSuggestionByTime(
      "Threshold",
      60 * 60,
      0.8,
      threshold_pace,
      threshold_time
    ),
  ];

  return { list: r, fixedList, ish_vdot_suggestions, suggestions };
}

//const threshold_pace = secondsFromPaceString("5:30");
//const threshold_time = 60 * 60;
//main(threshold_pace, threshold_time);
