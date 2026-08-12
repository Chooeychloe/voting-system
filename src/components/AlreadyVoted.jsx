function AlreadyVoted() {
  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
        <svg
          className="h-8 w-8 text-yellow-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m0 3.75h.007M10.29 3.86l-7.5 13A1.5 1.5 0 004.09 19h15.82a1.5 1.5 0 001.3-2.25l-7.5-13a1.5 1.5 0 00-2.6 0z"
          />
        </svg>
      </div>

      <h1 className="mt-6 text-2xl font-bold text-gray-900">
        Already Voted
      </h1>

      <p className="mt-2 text-gray-500">
        This student number has already been used to
        cast a vote.
      </p>

      <p className="mt-4 text-sm text-gray-400">
        Each student is allowed to vote only once.
      </p>
    </div>
  );
}

export default AlreadyVoted;