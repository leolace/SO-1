import { Link } from "react-router";
import type { Route } from "./+types";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <div>
      <h1 className="text-2xl font-semibold ">
        Sistemas Operacionais - Frontend
      </h1>
      <p>Utilize a header para navegar entre os módulos.</p>
    </div>
  );
}
