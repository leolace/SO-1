import { Link } from "react-router";
import { NavItem } from "./_compose/nav-item";

export const Header = () => {
  return (
    <header className="bg-gray-700 text-white p-4 sticky top-0 z-50">
      <nav className="container mx-auto flex justify-between items-center">
        <ul className="flex space-x-4">
          <NavItem to="/">
            Início
          </NavItem>
        </ul>
        <ul className="flex gap-4">
          <NavItem to="/1">Checkpoint 1</NavItem>
          <NavItem to="/2">Checkpoint 2</NavItem>
          <NavItem to="/3">Checkpoint 3</NavItem>
        </ul>
      </nav>
    </header>
  );
};
