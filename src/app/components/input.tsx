import { cn } from "#src/utils/cn";
import * as React from "react";

export type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value"
> & {
  value?: string | number | readonly string[] | null;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, value, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "border-neutral-200 file:text-neutral-950 placeholder:text-neutral-500 focus-visible:ring-neutral-950/25 bg-neutral-0 ring-offset-neutral-50 flex h-10 w-full rounded-md border px-3 py-2 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "data-[invalid='true']:border-red-400 data-[invalid='true']:focus-visible:ring-0",
          className
        )}
        ref={ref}
        value={value ?? undefined}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
