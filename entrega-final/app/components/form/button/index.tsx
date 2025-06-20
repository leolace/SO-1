import { twMerge } from "tailwind-merge";
import type { ButtonProps } from "./types";

export const Button = ({ children, className, ...props }: ButtonProps) => {
  return (
    <button
      className={twMerge(
        "text-white bg-gray-700 hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-md text-sm px-5 py-2.5 cursor-pointer transition-colors duration-200",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
