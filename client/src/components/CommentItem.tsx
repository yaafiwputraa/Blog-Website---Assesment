import { useState } from "react";
import type { Comment } from "../types";
import { getApiError } from "../utils/apiError";
import { formatDate } from "../utils/date";
import { Alert } from "./Alert";
import { Avatar } from "./Avatar";
import { Button } from "./Button";
import { CommentForm } from "./CommentForm";

interface CommentItemProps {
  comment: Comment;
  canManage: boolean;
  onUpdate: (commentId: string, content: string) => Promise<void>;
  onDelete: (commentId: string) => Promise<void>;
}

export function CommentItem({ comment, canManage, onUpdate, onDelete }: CommentItemProps) {
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  async function handleDelete() {
    const confirmed = window.confirm("Delete this comment?");
    if (!confirmed) {
      return;
    }

    setDeleting(true);
    setDeleteError("");
    try {
      await onDelete(comment.id);
    } catch (error) {
      setDeleteError(getApiError(error, "Unable to delete this comment.").message);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <article className="border border-neutral-200 p-4">
      <div className="mb-3 flex items-start gap-3">
        <Avatar avatarUrl={comment.author.avatarUrl} name={comment.author.name} size="sm" />
        <div>
          <p className="font-sans text-sm font-semibold text-neutral-950">{comment.author.name}</p>
          <p className="font-sans text-xs uppercase tracking-[0.08em] text-neutral-500">
            {formatDate(comment.createdAt)}
          </p>
        </div>
      </div>

      {deleteError ? (
        <Alert className="mb-3" variant="error">
          {deleteError}
        </Alert>
      ) : null}

      {editing ? (
        <CommentForm
          initialValue={comment.content}
          onCancel={() => setEditing(false)}
          onSubmit={(content) => onUpdate(comment.id, content)}
          onSuccess={() => setEditing(false)}
          submitLabel="Save comment"
        />
      ) : (
        <p className="whitespace-pre-wrap font-sans text-sm leading-6 text-neutral-700">
          {comment.content}
        </p>
      )}

      {canManage && !editing ? (
        <div className="mt-4 flex flex-wrap gap-2">
          <Button className="px-3 py-1" onClick={() => setEditing(true)} variant="outline">
            Edit
          </Button>
          <Button className="px-3 py-1" disabled={deleting} onClick={handleDelete} variant="danger">
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      ) : null}
    </article>
  );
}
