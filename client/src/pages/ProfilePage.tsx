import { useCallback, useEffect, useState, type FormEvent } from "react";
import { postsApi } from "../api/posts.api";
import { usersApi } from "../api/users.api";
import { Alert } from "../components/Alert";
import { Avatar } from "../components/Avatar";
import { Button } from "../components/Button";
import { Pagination } from "../components/Pagination";
import { PostCard } from "../components/PostCard";
import { Spinner } from "../components/Spinner";
import { useAuth } from "../hooks/useAuth";
import type { PostListResponse } from "../types";
import { getErrorMessage } from "../utils/apiError";
import { formatDate } from "../utils/date";

const PROFILE_PAGE_SIZE = 5;

export function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState<PostListResponse | null>(null);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [postsError, setPostsError] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const userId = user?.id;

  const loadPosts = useCallback(async () => {
    if (!userId) {
      return;
    }

    setLoadingPosts(true);
    setPostsError("");

    try {
      const response = await postsApi.list({
        author: userId,
        page,
        limit: PROFILE_PAGE_SIZE,
      });
      setPosts(response);
    } catch (error) {
      setPostsError(getErrorMessage(error, "Unable to load your posts."));
    } finally {
      setLoadingPosts(false);
    }
  }, [page, userId]);

  useEffect(() => {
    void loadPosts();
  }, [loadPosts]);

  async function handleUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedFile) {
      setUploadError("Choose an image file first.");
      setUploadSuccess("");
      return;
    }

    setUploading(true);
    setUploadError("");
    setUploadSuccess("");

    try {
      const updatedUser = await usersApi.uploadAvatar(selectedFile);
      updateUser(updatedUser);
      setSelectedFile(null);
      setUploadSuccess("Avatar updated.");
    } catch (error) {
      setUploadError(getErrorMessage(error, "Unable to upload avatar."));
    } finally {
      setUploading(false);
    }
  }

  if (!user) {
    return <Spinner label="Loading profile..." />;
  }

  return (
    <div className="space-y-10">
      <section className="grid gap-8 border-b border-neutral-200 pb-8 lg:grid-cols-[18rem_1fr]">
        <div className="space-y-4">
          <Avatar avatarUrl={user.avatarUrl} name={user.name} size="lg" />
          <form className="space-y-3" onSubmit={handleUpload}>
            <div className="space-y-2">
              <label
                className="block font-sans text-sm font-semibold text-neutral-900"
                htmlFor="avatar"
              >
                Upload avatar
              </label>
              <input
                accept="image/*"
                className="w-full border border-neutral-300 bg-white px-3 py-2 font-sans text-sm text-neutral-950 file:mr-3 file:border-0 file:bg-neutral-950 file:px-3 file:py-2 file:font-sans file:text-sm file:font-semibold file:uppercase file:tracking-[0.08em] file:text-white"
                id="avatar"
                onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
                type="file"
              />
            </div>
            {uploadError ? <Alert variant="error">{uploadError}</Alert> : null}
            {uploadSuccess ? <Alert variant="success">{uploadSuccess}</Alert> : null}
            <Button disabled={uploading} type="submit">
              {uploading ? "Uploading..." : "Upload"}
            </Button>
          </form>
        </div>

        <div>
          <p className="mb-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-red-800">
            Profile
          </p>
          <h1 className="font-serif text-5xl font-bold leading-tight text-neutral-950">
            {user.name}
          </h1>
          <dl className="mt-6 grid gap-4 border-t border-neutral-200 pt-6 font-sans text-sm sm:grid-cols-2">
            <div>
              <dt className="font-semibold uppercase tracking-[0.08em] text-neutral-500">Email</dt>
              <dd className="mt-1 text-neutral-950">{user.email}</dd>
            </div>
            <div>
              <dt className="font-semibold uppercase tracking-[0.08em] text-neutral-500">
                Member since
              </dt>
              <dd className="mt-1 text-neutral-950">{formatDate(user.createdAt)}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex flex-col gap-2 border-b border-neutral-200 pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-red-800">
              Archive
            </p>
            <h2 className="font-serif text-4xl font-bold text-neutral-950">Your Posts</h2>
          </div>
          {posts ? (
            <p className="font-sans text-sm text-neutral-500">
              {posts.pagination.total} {posts.pagination.total === 1 ? "post" : "posts"}
            </p>
          ) : null}
        </div>

        {postsError ? (
          <Alert title="Could not load posts" variant="error">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <span>{postsError}</span>
              <Button onClick={loadPosts} variant="outline">
                Retry
              </Button>
            </div>
          </Alert>
        ) : null}

        {loadingPosts ? <Spinner label="Loading your posts..." /> : null}

        {!loadingPosts && posts ? (
          <>
            {posts.posts.length ? (
              <div className="grid gap-5 md:grid-cols-2">
                {posts.posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="border border-neutral-300 p-8 text-center font-sans text-sm text-neutral-500">
                You have not published any posts yet.
              </div>
            )}

            <Pagination
              onPageChange={setPage}
              page={posts.pagination.page}
              totalPages={posts.pagination.totalPages}
            />
          </>
        ) : null}
      </section>
    </div>
  );
}
