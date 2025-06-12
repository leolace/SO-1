import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { execSync } from "child_process";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const input = url.searchParams.get("input");

  try {
    const output = execSync(
      "cd ./checkpoints/1 && ./io.out",
      !!input
        ? {
            input,
          }
        : undefined
    ).toString();
    return Response.json(output.trim());
  } catch (error) {
    console.error("Error executing C program:", error);
    return Response.json("Error executing C program", { status: 500 });
  }
}
