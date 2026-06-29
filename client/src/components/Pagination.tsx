import { Button } from "./Button";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function pageWindow(page: number, totalPages: number) {
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);
  const pages: number[] = [];

  for (let current = start; current <= end; current += 1) {
    pages.push(current);
  }

  return pages;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-wrap items-center justify-center gap-2 font-sans"
    >
      <Button
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        variant="outline"
      >
        Previous
      </Button>

      {pageWindow(page, totalPages).map((pageNumber) => (
        <Button
          aria-current={pageNumber === page ? "page" : undefined}
          className="min-w-11 px-3"
          key={pageNumber}
          onClick={() => onPageChange(pageNumber)}
          variant={pageNumber === page ? "solid" : "outline"}
        >
          {pageNumber}
        </Button>
      ))}

      <Button
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        variant="outline"
      >
        Next
      </Button>
    </nav>
  );
}
