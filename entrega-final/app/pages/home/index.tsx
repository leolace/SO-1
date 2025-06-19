import { Link, useLoaderData } from "react-router";
import { prisma } from "~/prisma";

export const loader = async () => {
  return prisma.comment.findMany();
};

export default function Home() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <h1 className="text-2xl font-semibold ">
        Sistemas Operacionais - Frontend
      </h1>
      <p>Utilize a header para navegar entre os módulos.</p>

      {data?.map((comment: { id: string; content: string }) => (
        <div key={comment.id} className="my-4 p-4 border rounded">
          <p className="text-lg">{comment.content}</p>
          <Link
            to={`/comments/${comment.id}`}
            className="text-blue-500 hover:underline"
          >
            Ver detalhes
          </Link>
        </div>
      ))}
    </div>
  );
}
