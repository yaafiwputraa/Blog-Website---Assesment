import { useEffect, useState, type FormEvent } from "react";
import { Button } from "./Button";

interface SearchBarProps {
  initialValue: string;
  onSearch: (term: string) => void;
}

export function SearchBar({ initialValue, onSearch }: SearchBarProps) {
  const [term, setTerm] = useState(initialValue);

  useEffect(() => {
    setTerm(initialValue);
  }, [initialValue]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearch(term.trim());
  }

  function handleClear() {
    setTerm("");
    onSearch("");
  }

  return (
    <form className="flex flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="post-search">
        Search posts
      </label>
      <input
        className="min-h-11 flex-1 border border-neutral-300 bg-white px-3 py-2 font-sans text-sm text-neutral-950 outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-950"
        id="post-search"
        onChange={(event) => setTerm(event.target.value)}
        placeholder="Search by title or content"
        type="search"
        value={term}
      />
      <div className="flex gap-2">
        <Button className="flex-1 sm:flex-none" type="submit">
          Search
        </Button>
        {initialValue ? (
          <Button className="flex-1 sm:flex-none" onClick={handleClear} variant="outline">
            Clear
          </Button>
        ) : null}
      </div>
    </form>
  );
}
