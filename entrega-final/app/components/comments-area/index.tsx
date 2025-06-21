import { useRef, type FormEvent } from "react";
import type { CommentParams } from "./types";
import { Button } from "../form/button";
import { useAddCommentMutation, useCommentsQuery } from "./queries";

export const CommentsArea = ({ sectionId }: CommentParams) => {
  const { comments } = useCommentsQuery(sectionId);
  const { mutateAddComment } = useAddCommentMutation(sectionId);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const comment = form.get("data")?.toString() || "";

    if (comment.trim()) {
      mutateAddComment(comment, {
        onSuccess: () => {
          if (textAreaRef.current) textAreaRef.current.value = "";
        },
      });
    }
  };

  return (
    <div className="grid gap-4">
      <h2 className="text-xl font-medium">Comentários</h2>
      <form className="grid gap-3" onSubmit={handleSubmit}>
        <textarea
          placeholder="Digite seu comentário aqui..."
          required
          className="block p-2.5 w-full text-md text-gray-900 bg-gray-100 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          name="data"
          ref={textAreaRef}
        />
        <Button className="justify-self-end">Enviar</Button>
      </form>
      <div className="grid gap-8 max-h-80 overflow-y-auto">
        {comments.length > 0 ? (
          comments.map(({ id, content }) => (
            <div
              key={id}
              className="grid grid-cols-[auto_1fr] gap-3 items-start border-b border-gray-300 pb-3"
            >
              <span className="w-10 h-10 bg-gray-200 block rounded-full" />
              <div>
                <p className="font-semibold">@usuario</p>
                <p>{content}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="no-comments">Nenhum comentário ainda.</p>
        )}
      </div>
    </div>
  );
};
