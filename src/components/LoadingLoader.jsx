import React from 'react'

const LoadingLoader = () => {
  return (
    <div>
      <div className="flex justify-center h-screen items-center">
        <div className="animate-spin size-8 border-2 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    </div>
  );
}

export default LoadingLoader
