import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import { Header } from "./header";
import type { Route } from "./+types";
import { Provider } from "./provider";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "SO" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

const Layout = () => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Provider>
          <Header />

          <main className="container mx-auto p-4 max-w-[70rem]">
            <Outlet />
          </main>
        </Provider>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
};

export default Layout;
