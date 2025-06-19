import { twMerge } from "tailwind-merge";
import Spinner from "../spinner";
import type { OutputProps } from "./types";

export const Output = ({ output, loading }: OutputProps) => {
  return (
    <div className="relative">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        {loading && <Spinner />}
      </div>
      <pre className={twMerge("p-2 bg-gray-200 ring ring-gray-300 rounded", loading && "opacity-50")}>{output}</pre>
    </div>
  );
};
