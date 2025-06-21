import { twMerge } from "tailwind-merge";
import Spinner from "../spinner";
import type { OutputProps } from "./types";

export const Output = ({ output, loading }: OutputProps) => {
  return (
    <div className="relative">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        {loading && <Spinner />}
      </div>
      <div className="pt-10 pb-3 px-5 bg-gray-100 ring ring-gray-300 rounded min-h-28 max-h-96 overflow-y-auto">
        <span className="absolute top-0 left-0 px-5 py-1 bg-gray-300 w-full text-neutral-700">
          Output
        </span>
        <pre className={twMerge("", loading && "opacity-50")}>{output}</pre>
      </div>
    </div>
  );
};
