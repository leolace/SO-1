import { cva } from "class-variance-authority";
import type { HTMLAttributes, PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

export interface TypographyProps extends HTMLAttributes<HTMLElement> {
  tag?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
}

export const typographyVariants = cva(["text-gray-900"], {
  variants: {
    tag: {
      h1: "text-3xl font-bold",
      h2: "text-2xl font-semibold",
      h3: "text-xl font-semibold",
      h4: "text-lg font-medium",
      p: "text-base mb-2",
      span: "block text-sm text-gray-600",
    },
  },
});

export const Typography = ({
  children,
  className,
  tag = "p",
  ...props
}: PropsWithChildren<TypographyProps>) => {
  const Component = tag;

  return (
    <Component
      className={twMerge(typographyVariants({ tag, className }))}
      {...props}
    >
      {children}
    </Component>
  );
};
