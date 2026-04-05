export default function Loading() {
    return (
      <div className="flex flex-1 flex-col px-4 pt-6">
        <h1 className="text-xl font-semibold tracking-tight">Create order</h1>
  
        <div className="mt-6 flex flex-col gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800"
            />
          ))}
        </div>
      </div>
    );
  }