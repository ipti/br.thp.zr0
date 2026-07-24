export default function ProductLoading() {
  return (
    <div className="p-4">
      <div className="text-center mb-4">
        <div className="h-12 w-32 bg-gray-200 rounded mx-auto mb-4 animate-pulse" />
        <div className="h-4 w-full max-w-2xl bg-gray-200 rounded mx-auto mb-2 animate-pulse" />
        <div className="h-4 w-full max-w-2xl bg-gray-200 rounded mx-auto animate-pulse" />
      </div>

      <div className="mb-6 flex gap-4 flex-wrap">
        <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
        <div className="h-10 w-40 bg-gray-200 rounded animate-pulse" />
        <div className="h-10 w-40 bg-gray-200 rounded animate-pulse" />
      </div>

      <div className="grid mb-20">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="col-12 sm:col-6 lg:col-4 xl:col-3 p-2">
            <div className="bg-gray-100 rounded animate-pulse h-64" />
          </div>
        ))}
      </div>
    </div>
  )
}
