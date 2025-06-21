import { cva } from "class-variance-authority";
import type { PropsWithChildren } from "react";

export interface TypographyProps {
  tag?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
}

export const typographyVariants = cva(["text-gray-900"], {
  variants: {
    tag: {
      h1: "text-3xl font-bold",
      h2: "text-2xl font-semibold",
      h3: "text-lg font-semibold",
      h4: "text-base font-semibold",
      p: "text-base",
      span: "text-sm",
    },
  },
});

export const Typography = ({
  children,
  tag = "p",
}: PropsWithChildren<TypographyProps>) => {
  const Component = tag;

  return (
    <Component className={typographyVariants({ tag })}>{children}</Component>
  );
};
