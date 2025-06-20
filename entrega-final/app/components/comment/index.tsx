import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, type FormEvent } from "react";
import { client } from "~/api/client";
import type { Comment, CommentParams } from "./types";
import { Button } from "../form/button";

export const CommentsArea = ({ sectionId }: CommentParams) => {
  const { data: comments } = useQuery({
    queryKey: ["comments", sectionId],
    queryFn: async () => {
      const response = await client<Comment[]>(`/comments/${sectionId}`);
      return response.data;
    },
    initialData: [],
    staleTime: 0,
  });
  const { mutate } = useMutation({
    mutationKey: ["comments", sectionId],
    mutationFn: async (newComment: string) => {
      const response = await client.post("/comment", {
        data: newComment,
        sectionId,
      });
      return response.data;
    },
  });
  const queryClient = useQueryClient();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const comment = form.get("data")?.toString() || "";

    if (comment.trim()) {
      mutate(comment, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["comments", sectionId] });
          if (textAreaRef.current) textAreaRef.current.value = "";
        },
        onError: (error) => {
          console.error("Error submitting comment:", error);
        },
      });
    }
  };

  return (
    <div className="grid gap-5">
      <h2 className="text-xl font-medium">Comentários</h2>
      <div className="border border-gray-300 rounded-md p-4 grid gap-4">
        {comments.length > 0 ? (
          comments.map((c: { id: string; content: string }) => (
            <div key={c.id} className="flex gap-3 items-start">
              <span className="w-10 h-10 bg-gray-200 block rounded-full"/>
              <div>
                <p className="font-semibold">@usuario</p>
                <p>{c.content}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="no-comments">Nenhum comentário ainda.</p>
        )}
      </div>
      <form className="grid gap-3" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="comment"
            className="block mb-1 text-sm font-medium text-gray-900"
          >
            Deixe seu comentário
          </label>
          <textarea
            placeholder="Write your comment here..."
            className="block p-2.5 w-full text-md text-gray-900 bg-gray-200 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            name="data"
            id="comment"
            ref={textAreaRef}
          />
        </div>
        <Button className="justify-self-end">Enviar</Button>
      </form>
    </div>
  );
};
