import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { client } from "~/api/client";
import type { Comment } from "./types";

export const useCommentsQuery = (sectionId: string) => {
  const { data: comments, ...query } = useQuery({
    queryKey: ["comments", sectionId],
    queryFn: async () => {
      const response = await client<Comment[]>(`/comments/${sectionId}`);
      return response.data;
    },
    initialData: [],
    staleTime: 0,
  });

  return { comments, ...query };
};

export const useAddCommentMutation = (sectionId: string) => {
  const queryClient = useQueryClient();

  const { mutate: mutateAddComment, ...mutation } = useMutation({
    mutationKey: ["comments", sectionId],
    mutationFn: async (newComment: string) => {
      const response = await client.post("/comment", {
        data: newComment,
        sectionId,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", sectionId] });
    },
    onError: (error) => {
      console.error("Error submitting comment:", error);
    },
  });

  return { mutateAddComment, ...mutation };
};
