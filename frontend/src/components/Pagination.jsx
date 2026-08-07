const Pagination = ({ page, pages, onChange }) => {
  if (pages <= 1) return null;
  const items = Array.from({ length: pages }, (_, i) => i + 1).slice(
    Math.max(0, page - 3),
    Math.max(0, page - 3) + 5
  );

  return (
    <div className="mt-10 flex items-center justify-center gap-2">
      <button
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className="rounded-full border border-ink/10 dark:border-paper/20 px-3 py-1.5 text-sm disabled:opacity-30"
      >
        Prev
      </button>
      {items.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`h-9 w-9 rounded-full text-sm font-medium ${
            p === page ? 'bg-lagoon-500 text-paper' : 'border border-ink/10 dark:border-paper/20'
          }`}
        >
          {p}
        </button>
      ))}
      <button
        disabled={page >= pages}
        onClick={() => onChange(page + 1)}
        className="rounded-full border border-ink/10 dark:border-paper/20 px-3 py-1.5 text-sm disabled:opacity-30"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
