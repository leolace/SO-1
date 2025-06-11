import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("1", "routes/checkpoint-1.tsx"),
  route("c-1", "api/checkpoint-1.ts"),
] satisfies RouteConfig;
