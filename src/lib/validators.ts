import { z } from "zod";

export const zPaceString = z
  .custom<string>((x) => {
    try {
      const [a, b] = x.split(":");
      if (b.length !== 2) {
        return false;
      }
      const A = Number(a);
      const B = Number(b);
      if (isFinite(A) && isFinite(B) && B < 60) {
        if (60 * A + B < 150) {
          //a threshold pace less than 2:30 is unrealistic
          return false;
        }
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

export const zIntensityString = z
  .custom<string>((x) => {
    try {
      const n = Number(x);

      if (isFinite(n) && n >= 0 && n <= 100) {
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

export const zTimeString = z
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
