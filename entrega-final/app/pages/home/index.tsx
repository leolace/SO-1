import { Link, useLoaderData } from "react-router";
import type { Comment } from "~/components/comments-area/types";
import { Button } from "~/components/form/button";
import { Typography } from "~/components/typography";
import { prisma } from "~/prisma";

export const loader = async () => {
  return prisma.comment.findMany({ orderBy: { createdAt: "desc" } });
};

export default function Home() {
  const data = useLoaderData<typeof loader>();

  console.log("Comments data:", data);

  return (
    <div>
      <Typography tag="h1">Sistemas Operacionais - Frontend</Typography>
      <Typography>Utilize a header para navegar entre os módulos.</Typography>

      <div className="grid gap-3 mt-6">
        <div>
          <Typography tag="h2">Comentários</Typography>
          <Typography>
            Aqui você pode ver todos os comentários feitos pelos usuários sobre
            os checkpoints. Ao final de cada página de checkpoint, você pode
            adicionar o seu comentário, que será exibido aqui.
          </Typography>
        </div>

        {data?.map(({ id, content, sectionId, createdAt }: Comment) => (
          <div
            key={id}
            className="flex justify-between items-center p-2 border rounded border-gray-300"
          >
            <div>
              <Typography tag="h3">
                {sectionId.replace("checkpoint", "Checkpoint ")}
              </Typography>
              <Typography tag="span" className="mb-2">
                {new Date(createdAt).toLocaleDateString("pt-BR", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Typography>
              <Typography className="mb-0">{content}</Typography>
            </div>

            <Link to={`/${sectionId.replace("checkpoint", "")}`}>
              <Button>Conferir</Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
