import React, { useState, type FormEvent } from "react";
import { useFetcher } from "react-router";

interface CommentBoxProps {
  onSubmit: (comment: string) => void;
}

export const Comment = () => {
  const [comment, setComment] = useState("");
  const fetcher = useFetcher();

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(event.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(e);
    if (comment.trim()) {
      fetcher.submit(e?.currentTarget.form);
    }
  };

  return (
    <div className="comment-box">
      <fetcher.Form method="post" action="/comment"  className="comment-form" onSubmit={handleSubmit}>
        <textarea
          value={comment}
          onChange={handleInputChange}
          placeholder="Write your comment here..."
          className="comment-input"
        />
        <button type="submit" className="comment-submit">
          Submit
        </button>
      </fetcher.Form>
    </div>
  );
};
