import React from "react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-10">
      <div className="relative">
        <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-pink-500 animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="h-12 w-12 text-pink-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
        </div>
      </div>
      <h2 className="mt-6 text-xl font-semibold text-center text-gray-700 dark:text-gray-300">
        Ачаалж байна...
      </h2>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Бид таны хүсэлтийг боловсруулж байна
      </p>
    </div>
  );
}