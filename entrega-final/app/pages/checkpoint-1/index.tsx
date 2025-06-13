import { execSync } from "child_process";
import { useEffect, useState } from "react";
import { useFetcher, type LoaderFunctionArgs } from "react-router";
import { Output } from "~/components/output";
import { MemorySection } from "./memory";
import { ProcessSection } from "./process";
import { IOSection } from "./io";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const input = url.searchParams.get("input");
  const file = url.searchParams.get("file") || "io.out";

  try {
    const output = execSync(
      `cd ./checkpoints/1 && ./${file}`,
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

export default function Checkpoint1() {
  return (
    <div className="grid gap-12">
      <div className="grid gap-12">
        <section>
          <h2 className="text-2xl font-bold">Chamadas ao Sistema</h2>
          <p className="text-lg">
            Nesta seção, abordaremos sobre 3 tipos de chamadas de sistemas
            primitivas de sistemas, sendo elas: de gerenciamento de memória,
            processos, E/S e arquivos..
          </p>
        </section>

        <MemorySection />
        <ProcessSection />
        <IOSection />
      </div>

      <section>
        <h2 className="text-2xl font-bold mb-4">
          Processos CPU-Bound e IO-Bound
        </h2>
      </section>
    </div>
  );
}
