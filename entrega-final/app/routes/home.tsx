import { Link } from "react-router";
import type { Route } from "./+types/home";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-lg mb-6">
        Sistemas Operacionais - Frontend
      </h1>
      <div>
        <Link
          to="/1"
          className="text-blue-500 hover:text-blue-700 underline"
        >
          Go to Checkpoint 1
        </Link>
      </div>
    </div>
  );
}
