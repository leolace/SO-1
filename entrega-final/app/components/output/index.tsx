import type { OutputProps } from "./types";

export const Output = ({ output }: OutputProps) => {
  return (
    <div>
      <pre className="p-2 bg-gray-200 ring ring-gray-300 rounded">{output}</pre>
    </div>
  );
};
