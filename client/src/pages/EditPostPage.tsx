import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { postsApi } from "../api/posts.api";
import { Alert } from "../components/Alert";
import { PostForm, type PostFormSubmitValues } from "../components/PostForm";
import { Spinner } from "../components/Spinner";
import { useAuth } from "../hooks/useAuth";
import type { Post } from "../types";
import { getErrorMessage } from "../utils/apiError";

export function EditPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPost = useCallback(async () => {
    if (!id) {
      setError("Post not found.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const nextPost = await postsApi.getById(id);
      setPost(nextPost);
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Unable to load this post."));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void loadPost();
  }, [loadPost]);

  async function handleSubmit(values: PostFormSubmitValues) {
    if (!id) {
      return;
    }

    const updatedPost = await postsApi.update(id, values);
    navigate(`/posts/${updatedPost.id}`);
  }

  if (loading) {
    return <Spinner label="Loading editor..." />;
  }

  if (error) {
    return (
      <Alert title="Could not load editor" variant="error">
        <div className="space-y-3">
          <p>{error}</p>
          <Link className="font-semibold text-red-800 hover:text-red-950" to="/">
            Back to all posts
          </Link>
        </div>
      </Alert>
    );
  }

  if (!post) {
    return (
      <Alert title="Post not found" variant="error">
        This post is no longer available.
      </Alert>
    );
  }

  if (user?.id !== post.author.id) {
    return (
      <Alert title="Not allowed" variant="error">
        You can only edit posts that you authored.
      </Alert>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header className="border-b border-neutral-200 pb-6">
        <p className="mb-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-red-800">
          Revise
        </p>
        <h1 className="font-serif text-5xl font-bold leading-tight text-neutral-950">
          Edit Post
        </h1>
      </header>

      <PostForm
        initialValues={{
          title: post.title,
          content: post.content,
          category: post.category ?? "",
        }}
        onSubmit={handleSubmit}
        submitLabel="Save changes"
      />
    </div>
  );
}
