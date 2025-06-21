import type { ButtonHTMLAttributes } from "react";

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  type?: "primary" | "secondary";
  buttonType?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
}
