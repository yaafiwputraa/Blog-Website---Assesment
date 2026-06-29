import { Link } from "react-router-dom";
import type { Post } from "../types";
import { formatDate } from "../utils/date";
import { excerpt } from "../utils/text";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="border border-neutral-300 bg-white p-5 transition-colors hover:border-neutral-950">
      <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2 font-sans text-xs uppercase tracking-[0.08em] text-neutral-500">
        <span>{formatDate(post.createdAt)}</span>
        <span aria-hidden="true">/</span>
        <span>{post.author.name}</span>
        {post.category ? (
          <>
            <span aria-hidden="true">/</span>
            <span className="border border-neutral-300 px-2 py-1 text-neutral-700">
              {post.category}
            </span>
          </>
        ) : null}
      </div>

      <h2 className="font-serif text-3xl font-bold leading-tight text-neutral-950">
        <Link className="hover:text-red-800" to={`/posts/${post.id}`}>
          {post.title}
        </Link>
      </h2>

      <p className="mt-4 font-serif text-base leading-7 text-neutral-700">{excerpt(post.content)}</p>

      <div className="mt-5 flex items-center justify-between gap-4 border-t border-neutral-200 pt-4 font-sans text-sm">
        <span className="text-neutral-500">
          {post._count.comments} {post._count.comments === 1 ? "comment" : "comments"}
        </span>
        <Link
          className="font-semibold uppercase tracking-[0.08em] text-red-800 hover:text-red-950"
          to={`/posts/${post.id}`}
        >
          Read more
        </Link>
      </div>
    </article>
  );
}
