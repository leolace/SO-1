import { NavLink, useLocation } from "react-router";
import type { NavItemProps } from "./types";
import { twMerge } from "tailwind-merge";

export const NavItem = ({ to, children }: NavItemProps) => {
  const { pathname } = useLocation();

  return (
    <li
      className={twMerge(
        "bg-white text-black px-2 py-1 rounded hover:bg-gray-200 outline outline-gray-700 cursor-pointer",
        pathname === to && "bg-gray-800 text-white hover:bg-gray-800"
      )}
    >
      <NavLink to={to}>{children}</NavLink>
    </li>
  );
};
