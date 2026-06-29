import { useState, type FormEvent } from "react";
import { fieldErrorMessage, getApiError, type ApiErrorDetails } from "../utils/apiError";
import { Button } from "./Button";
import { Alert } from "./Alert";
import { TextArea, TextInput } from "./FormField";

export interface PostFormValues {
  title: string;
  content: string;
  category: string;
}

export interface PostFormSubmitValues {
  title: string;
  content: string;
  category?: string;
}

interface PostFormProps {
  initialValues: PostFormValues;
  submitLabel: string;
  onSubmit: (values: PostFormSubmitValues) => Promise<void>;
}

type ValidationErrors = Partial<Record<keyof PostFormValues, string>>;

function validate(values: PostFormValues) {
  const errors: ValidationErrors = {};

  if (!values.title.trim()) {
    errors.title = "Title is required";
  }

  if (!values.content.trim()) {
    errors.content = "Content is required";
  }

  return errors;
}

export function PostForm({ initialValues, submitLabel, onSubmit }: PostFormProps) {
  const [values, setValues] = useState(initialValues);
  const [clientErrors, setClientErrors] = useState<ValidationErrors>({});
  const [apiError, setApiError] = useState<ApiErrorDetails | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validate(values);
    setClientErrors(nextErrors);
    setApiError(null);

    if (Object.keys(nextErrors).length) {
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        title: values.title.trim(),
        content: values.content.trim(),
        category: values.category.trim() || undefined,
      });
    } catch (error) {
      setApiError(getApiError(error, "Unable to save this post."));
    } finally {
      setSubmitting(false);
    }
  }

  const serverFieldErrors = apiError?.fieldErrors ?? [];

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {apiError ? (
        <Alert title="Unable to save post" variant="error">
          {apiError.message}
        </Alert>
      ) : null}

      <TextInput
        error={clientErrors.title ?? fieldErrorMessage(serverFieldErrors, "title")}
        id="post-title"
        label="Title"
        onChange={(event) => setValues((current) => ({ ...current, title: event.target.value }))}
        placeholder="A precise, memorable headline"
        value={values.title}
      />

      <TextArea
        className="min-h-96 font-serif text-base leading-7"
        error={clientErrors.content ?? fieldErrorMessage(serverFieldErrors, "content")}
        hint="Markdown supported"
        id="post-content"
        label="Content"
        onChange={(event) => setValues((current) => ({ ...current, content: event.target.value }))}
        placeholder="Write the full article..."
        value={values.content}
      />

      <TextInput
        error={clientErrors.category ?? fieldErrorMessage(serverFieldErrors, "category")}
        hint="Optional"
        id="post-category"
        label="Category"
        onChange={(event) =>
          setValues((current) => ({ ...current, category: event.target.value }))
        }
        placeholder="Opinion, Engineering, Notes"
        value={values.category}
      />

      <Button disabled={submitting} type="submit">
        {submitting ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}
