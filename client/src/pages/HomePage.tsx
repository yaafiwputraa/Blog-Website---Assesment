import { useCallback, useEffect, useState } from "react";
import { postsApi } from "../api/posts.api";
import { Alert } from "../components/Alert";
import { Button } from "../components/Button";
import { Pagination } from "../components/Pagination";
import { PostCard } from "../components/PostCard";
import { SearchBar } from "../components/SearchBar";
import { Spinner } from "../components/Spinner";
import type { PostListResponse } from "../types";
import { getErrorMessage } from "../utils/apiError";
import { useSearchParams } from "react-router-dom";

const PAGE_SIZE = 6;

function parsePage(value: string | null) {
  const page = Number(value);
  return Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
}

export function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") ?? "";
  const page = parsePage(searchParams.get("page"));
  const [data, setData] = useState<PostListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await postsApi.list({
        search: search || undefined,
        page,
        limit: PAGE_SIZE,
      });
      setData(response);
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Unable to load posts."));
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const response = await postsApi.list({
          search: search || undefined,
          page,
          limit: PAGE_SIZE,
        });
        if (isMounted) {
          setData(response);
        }
      } catch (requestError) {
        if (isMounted) {
          setError(getErrorMessage(requestError, "Unable to load posts."));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      isMounted = false;
    };
  }, [page, search]);

  function handleSearch(term: string) {
    const nextParams = new URLSearchParams();
    if (term) {
      nextParams.set("search", term);
    }
    nextParams.set("page", "1");
    setSearchParams(nextParams);
  }

  function handlePageChange(nextPage: number) {
    const nextParams = new URLSearchParams();
    if (search) {
      nextParams.set("search", search);
    }
    nextParams.set("page", String(nextPage));
    setSearchParams(nextParams);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="space-y-8">
      <section className="border-b border-neutral-200 pb-8">
        <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-red-800">
          Latest dispatches
        </p>
        <div className="grid gap-6 lg:grid-cols-[1fr_24rem] lg:items-end">
          <div>
            <h1 className="font-serif text-5xl font-bold leading-tight text-neutral-950 sm:text-6xl">
              All Posts
            </h1>
            <p className="mt-4 max-w-2xl font-sans text-base leading-7 text-neutral-600">
              Browse essays, notes, and updates from the community.
            </p>
          </div>
          <SearchBar initialValue={search} onSearch={handleSearch} />
        </div>
      </section>

      {error ? (
        <Alert title="Could not load posts" variant="error">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span>{error}</span>
            <Button onClick={loadPosts} variant="outline">
              Retry
            </Button>
          </div>
        </Alert>
      ) : null}

      {loading ? <Spinner label="Loading posts..." /> : null}

      {!loading && data ? (
        <>
          <div className="flex items-center justify-between border-b border-neutral-200 pb-3 font-sans text-sm text-neutral-500">
            <span>
              {data.pagination.total} {data.pagination.total === 1 ? "post" : "posts"}
            </span>
            <span>
              Page {data.pagination.page} of {data.pagination.totalPages}
            </span>
          </div>

          {data.posts.length ? (
            <div className="grid gap-5 md:grid-cols-2">
              {data.posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="border border-neutral-300 p-8 text-center font-sans text-sm text-neutral-500">
              No posts found.
            </div>
          )}

          <Pagination
            onPageChange={handlePageChange}
            page={data.pagination.page}
            totalPages={data.pagination.totalPages}
          />
        </>
      ) : null}
    </div>
  );
}
