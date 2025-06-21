import { useQuery } from "@tanstack/react-query";
import { client } from "~/api/client";

export const useRunQuery = (
  filename: string,
  directory: "1" | "2" | "3",
  mode: "default" | "time",
  input?: string,
) => {
  return useQuery({
    queryKey: ["run", directory, filename, input],
    queryFn: async () => {
      const response = await client.get<string>(
        `/run?filename=${filename}&directory=${directory}&mode=${mode}&input=${input || ""}`,
      );
      return response.data;
    },
  });
};
