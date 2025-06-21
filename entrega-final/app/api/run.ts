import { exec } from "child_process";
import path from "path";
import type { LoaderFunctionArgs } from "react-router";

type Mode = "default" | "time";

const formatCommand: Record<Mode, (filename: string) => string> = {
  default: (filename: string) => `./${filename}`,
  time: (filename: string) =>
    `time ./${filename} && /usr/bin/time -v ./${filename}`,
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const input = url.searchParams.get("input") || undefined;
  const filename = url.searchParams.get("filename");
  const directory = url.searchParams.get("directory");
  const mode = (url.searchParams.get("mode") as Mode) || "default";

  try {
    if (!filename || !directory) throw new Error("Missing required fields");
    const filePath = path.join("./checkpoints", directory);
    const command = `cd ${filePath} && ${formatCommand[mode](filename)}`;

    return await new Promise((resolve) => {
      const child = exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error("Error executing code:", error);
          resolve((stdout + "\n" + stderr).trim());
        } else {
          if (mode === "time") resolve((stdout + stderr).trim());
          else resolve(stdout.trim());
        }
      });
      if (input && child.stdin) {
        child.stdin.write(input.replaceAll("*", "\n"));
        child.stdin.end();
      }
    });
  } catch (error) {
    console.error("Error executing code:", error);
  }
};
