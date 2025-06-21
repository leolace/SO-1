import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("./layout/index.tsx", [
    index("./pages/home/index.tsx"),
    route("1", "./pages/checkpoint-1/index.tsx"),
    route("2", "./pages/checkpoint-2/index.tsx"),
    route("3", "./pages/checkpoint-3/index.tsx"),
  ]),
  route("comment", "./api/comment.ts"),
  route("comments/:sectionId", "./api/comments.ts"),
  route("run", "./api/run.ts"),
] satisfies RouteConfig;
