export function SkeletonCard() {
  return (
    <div className="flex-shrink-0 w-40 md:w-48 animate-pulse">
      <div className="aspect-[2/3] rounded-lg bg-white/10" />
      <div className="mt-2 h-3 w-3/4 rounded bg-white/10" />
      <div className="mt-1 h-2 w-1/2 rounded bg-white/10" />
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="mb-8">
      <div className="mb-3 h-5 w-48 rounded bg-white/10 animate-pulse" />
      <div className="flex gap-3 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}

export function SkeletonHero() {
  return (
    <div className="relative h-[85vh] animate-pulse bg-gradient-to-b from-gray-900 to-gray-950">
      <div className="absolute bottom-24 left-8 md:left-16 space-y-4">
        <div className="h-8 w-64 rounded bg-white/10" />
        <div className="h-4 w-96 rounded bg-white/10" />
        <div className="h-4 w-80 rounded bg-white/10" />
        <div className="mt-4 flex gap-3">
          <div className="h-10 w-28 rounded-full bg-white/20" />
          <div className="h-10 w-36 rounded-full bg-white/10" />
        </div>
      </div>
    </div>
  );
}
