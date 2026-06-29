import { useCallback, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Link, useNavigate, useParams } from "react-router-dom";
import remarkGfm from "remark-gfm";
import { commentsApi } from "../api/comments.api";
import { postsApi } from "../api/posts.api";
import { Alert } from "../components/Alert";
import { Avatar } from "../components/Avatar";
import { Button } from "../components/Button";
import { CommentForm } from "../components/CommentForm";
import { CommentList } from "../components/CommentList";
import { Spinner } from "../components/Spinner";
import { useAuth } from "../hooks/useAuth";
import type { Comment, Post } from "../types";
import { getApiError, getErrorMessage } from "../utils/apiError";
import { formatDate } from "../utils/date";

const markdownClasses =
  "font-serif text-lg leading-8 text-neutral-900 [&_a]:text-red-800 [&_a]:underline [&_blockquote]:border-l [&_blockquote]:border-neutral-300 [&_blockquote]:pl-5 [&_blockquote]:text-neutral-600 [&_code]:border [&_code]:border-neutral-300 [&_code]:bg-neutral-50 [&_code]:px-1 [&_code]:font-mono [&_h1]:mt-10 [&_h1]:font-serif [&_h1]:text-4xl [&_h1]:font-bold [&_h2]:mt-10 [&_h2]:font-serif [&_h2]:text-3xl [&_h2]:font-bold [&_h3]:mt-8 [&_h3]:font-serif [&_h3]:text-2xl [&_h3]:font-bold [&_hr]:my-8 [&_hr]:border-neutral-200 [&_img]:border [&_img]:border-neutral-300 [&_li]:my-2 [&_ol]:my-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-6 [&_pre]:my-6 [&_pre]:overflow-x-auto [&_pre]:border [&_pre]:border-neutral-300 [&_pre]:bg-neutral-50 [&_pre]:p-4 [&_pre_code]:border-0 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_strong]:font-bold [&_table]:my-6 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-neutral-300 [&_td]:p-2 [&_th]:border [&_th]:border-neutral-300 [&_th]:p-2 [&_th]:text-left [&_ul]:my-6 [&_ul]:list-disc [&_ul]:pl-6";

export function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mutationError, setMutationError] = useState("");
  const [deleting, setDeleting] = useState(false);

  const loadPost = useCallback(async () => {
    if (!id) {
      setError("Post not found.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const [nextPost, nextComments] = await Promise.all([
        postsApi.getById(id),
        commentsApi.listByPost(id),
      ]);
      setPost(nextPost);
      setComments(nextComments);
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Unable to load this post."));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void loadPost();
  }, [loadPost]);

  async function handleDeletePost() {
    if (!post) {
      return;
    }

    const confirmed = window.confirm("Delete this post?");
    if (!confirmed) {
      return;
    }

    setDeleting(true);
    setMutationError("");
    try {
      await postsApi.remove(post.id);
      navigate("/");
    } catch (requestError) {
      setMutationError(getApiError(requestError, "Unable to delete this post.").message);
    } finally {
      setDeleting(false);
    }
  }

  async function handleCreateComment(content: string) {
    if (!post) {
      return;
    }

    const comment = await commentsApi.create(post.id, { content });
    setComments((current) => [...current, comment]);
    setPost((current) =>
      current ? { ...current, _count: { comments: current._count.comments + 1 } } : current
    );
  }

  async function handleUpdateComment(commentId: string, content: string) {
    const updatedComment = await commentsApi.update(commentId, { content });
    setComments((current) =>
      current.map((comment) => (comment.id === commentId ? updatedComment : comment))
    );
  }

  async function handleDeleteComment(commentId: string) {
    await commentsApi.remove(commentId);
    setComments((current) => current.filter((comment) => comment.id !== commentId));
    setPost((current) =>
      current
        ? { ...current, _count: { comments: Math.max(0, current._count.comments - 1) } }
        : current
    );
  }

  if (loading) {
    return <Spinner label="Loading post..." />;
  }

  if (error) {
    return (
      <Alert title="Could not load post" variant="error">
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

  const canManagePost = user?.id === post.author.id;

  return (
    <div className="mx-auto max-w-4xl">
      <article>
        <header className="border-b border-neutral-200 pb-8">
          <div className="mb-5 flex flex-wrap items-center gap-3 font-sans text-xs uppercase tracking-[0.08em] text-neutral-500">
            <span>{formatDate(post.createdAt)}</span>
            {post.category ? (
              <span className="border border-neutral-300 px-2 py-1 text-neutral-700">
                {post.category}
              </span>
            ) : null}
          </div>

          <h1 className="font-serif text-5xl font-bold leading-tight text-neutral-950 sm:text-6xl">
            {post.title}
          </h1>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Avatar avatarUrl={post.author.avatarUrl} name={post.author.name} size="sm" />
              <div className="font-sans">
                <p className="text-sm font-semibold text-neutral-950">{post.author.name}</p>
                <p className="text-xs uppercase tracking-[0.08em] text-neutral-500">
                  {post._count.comments} {post._count.comments === 1 ? "comment" : "comments"}
                </p>
              </div>
            </div>

            {canManagePost ? (
              <div className="flex flex-wrap gap-2">
                <Link
                  className="inline-flex items-center justify-center border border-neutral-950 bg-white px-4 py-2 font-sans text-sm font-semibold uppercase tracking-[0.08em] text-neutral-950 transition-colors hover:bg-neutral-100"
                  to={`/posts/${post.id}/edit`}
                >
                  Edit
                </Link>
                <Button disabled={deleting} onClick={handleDeletePost} variant="danger">
                  {deleting ? "Deleting..." : "Delete"}
                </Button>
              </div>
            ) : null}
          </div>

          {mutationError ? (
            <Alert className="mt-5" variant="error">
              {mutationError}
            </Alert>
          ) : null}
        </header>

        <div className={markdownClasses}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
        </div>
      </article>

      <section className="mt-12 border-t border-neutral-200 pt-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-red-800">
              Discussion
            </p>
            <h2 className="font-serif text-4xl font-bold text-neutral-950">Comments</h2>
          </div>
          <p className="font-sans text-sm text-neutral-500">
            {comments.length} {comments.length === 1 ? "response" : "responses"}
          </p>
        </div>

        <div className="mb-6">
          {user ? (
            <div className="border border-neutral-300 p-4">
              <CommentForm onSubmit={handleCreateComment} resetOnSuccess />
            </div>
          ) : (
            <Alert>
              <Link className="font-semibold text-red-800 hover:text-red-950" to="/login">
                Log in
              </Link>{" "}
              to add a comment.
            </Alert>
          )}
        </div>

        <CommentList
          comments={comments}
          currentUserId={user?.id ?? null}
          onDelete={handleDeleteComment}
          onUpdate={handleUpdateComment}
        />
      </section>
    </div>
  );
}
