import type { Comment } from "../types";
import { CommentItem } from "./CommentItem";

interface CommentListProps {
  comments: Comment[];
  currentUserId: string | null;
  onUpdate: (commentId: string, content: string) => Promise<void>;
  onDelete: (commentId: string) => Promise<void>;
}

export function CommentList({ comments, currentUserId, onUpdate, onDelete }: CommentListProps) {
  if (!comments.length) {
    return (
      <div className="border border-neutral-200 p-5 font-sans text-sm text-neutral-500">
        No comments yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentItem
          canManage={currentUserId === comment.author.id}
          comment={comment}
          key={comment.id}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
}
