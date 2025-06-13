import { Outlet } from "react-router";
import { Header } from "./header";

export default () => {
  return (
    <div>
      <Header />

      <main className="container mx-auto p-4 max-w-[70rem]">
        <Outlet />
      </main>
    </div>
  );
}
