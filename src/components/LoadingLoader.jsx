import React from 'react'

const LoadingLoader = () => {
  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="skeleton h-7 w-40 mb-2" />
        <div className="skeleton h-4 w-64" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="card p-5 sm:p-6 flex items-center justify-between"
          >
            <div className="space-y-2.5">
              <div className="skeleton h-4 w-24" />
              <div className="skeleton h-6 w-12" />
            </div>
            <div className="skeleton size-10 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default LoadingLoader
