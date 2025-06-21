import { twMerge } from "tailwind-merge";
import type { ButtonProps } from "./types";
import { cva } from "class-variance-authority";
import type { PropsWithChildren } from "react";

const buttonVariants = cva(
  "text-white font-medium rounded-md text-sm px-5 py-2 cursor-pointer",
  {
    variants: {
      type: {
        primary:
          "bg-gray-700 hover:bg-blue-700 hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300",
        secondary:
          "bg-transparent text-gray-900 ring ring-gray-300 hover:ring-gray-400",
      },
    },
  },
);

export const Button = ({
  children,
  className,
  disabled,
  type = "primary",
  buttonType = "submit",
  ...props
}: PropsWithChildren<ButtonProps>) => {
  return (
    <button
      className={twMerge(
        buttonVariants({ type }),
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
      disabled={disabled}
      type={buttonType}
      {...props}
    >
      {children}
    </button>
  );
};
