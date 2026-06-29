import { useNavigate } from "react-router-dom";
import { postsApi } from "../api/posts.api";
import { PostForm, type PostFormSubmitValues } from "../components/PostForm";

export function CreatePostPage() {
  const navigate = useNavigate();

  async function handleSubmit(values: PostFormSubmitValues) {
    const post = await postsApi.create(values);
    navigate(`/posts/${post.id}`);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header className="border-b border-neutral-200 pb-6">
        <p className="mb-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-red-800">
          Publish
        </p>
        <h1 className="font-serif text-5xl font-bold leading-tight text-neutral-950">
          New Post
        </h1>
      </header>

      <PostForm
        initialValues={{ title: "", content: "", category: "" }}
        onSubmit={handleSubmit}
        submitLabel="Create post"
      />
    </div>
  );
}
