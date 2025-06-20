import { Outlet } from "react-router";
import { Header } from "./header";
import type { Route } from "./+types";
import { Provider } from "./provider";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "SO" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default () => {
  return (
    <Provider>
      <Header />

      <main className="container mx-auto p-4 max-w-[70rem]">
        <Outlet />
      </main>
    </Provider>
  );
};
