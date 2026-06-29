import { useEffect, useState, type FormEvent } from "react";
import { getApiError, type ApiErrorDetails } from "../utils/apiError";
import { Alert } from "./Alert";
import { Button } from "./Button";

interface CommentFormProps {
  initialValue?: string;
  submitLabel?: string;
  resetOnSuccess?: boolean;
  onCancel?: () => void;
  onSubmit: (content: string) => Promise<void>;
  onSuccess?: () => void;
}

export function CommentForm({
  initialValue = "",
  submitLabel = "Post comment",
  resetOnSuccess = false,
  onCancel,
  onSubmit,
  onSuccess,
}: CommentFormProps) {
  const [content, setContent] = useState(initialValue);
  const [fieldError, setFieldError] = useState("");
  const [apiError, setApiError] = useState<ApiErrorDetails | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setContent(initialValue);
  }, [initialValue]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!content.trim()) {
      setFieldError("Comment content is required");
      return;
    }

    setFieldError("");
    setApiError(null);
    setSubmitting(true);

    try {
      await onSubmit(content.trim());
      if (resetOnSuccess) {
        setContent("");
      }
      onSuccess?.();
    } catch (error) {
      setApiError(getApiError(error, "Unable to save this comment."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      {apiError ? (
        <Alert title="Unable to save comment" variant="error">
          {apiError.message}
        </Alert>
      ) : null}

      <div className="space-y-2">
        <label className="block font-sans text-sm font-semibold text-neutral-900" htmlFor="comment">
          Comment
        </label>
        <textarea
          aria-invalid={Boolean(fieldError)}
          className="min-h-28 w-full border border-neutral-300 bg-white px-3 py-2 font-sans text-sm leading-6 text-neutral-950 outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-950"
          id="comment"
          onChange={(event) => setContent(event.target.value)}
          placeholder="Add to the discussion"
          value={content}
        />
        {fieldError ? (
          <p className="font-sans text-xs font-medium text-red-800">{fieldError}</p>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button disabled={submitting} type="submit">
          {submitting ? "Saving..." : submitLabel}
        </Button>
        {onCancel ? (
          <Button disabled={submitting} onClick={onCancel} variant="outline">
            Cancel
          </Button>
        ) : null}
      </div>
    </form>
  );
}
