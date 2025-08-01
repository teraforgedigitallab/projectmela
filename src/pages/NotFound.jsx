import React from 'react'

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-5xl font-bold text-primary mb-4">404</h1>
      <p className="text-lg text-gray-700 mb-2">Page Not Found</p>
      <a href="/" className="text-primary underline hover:text-primary-hover transition">Go Home</a>
    </div>
  )
}

export default NotFound