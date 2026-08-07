const SkeletonCard = () => (
  <div className="overflow-hidden rounded-xl2 border border-ink/5 dark:border-paper/10 bg-white dark:bg-ink-light shadow-card">
    <div className="skeleton h-44 w-full" />
    <div className="space-y-3 p-4">
      <div className="skeleton h-4 w-3/4 rounded" />
      <div className="skeleton h-3 w-1/2 rounded" />
      <div className="skeleton h-3 w-1/3 rounded" />
    </div>
  </div>
);

export default SkeletonCard;
