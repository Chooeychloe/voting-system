function AlreadyVoted() {
  return (
    <div className="surface-card w-full max-w-lg rounded-3xl p-8 text-center sm:p-10">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 ring-1 ring-amber-100">
        <svg
          className="h-8 w-8 text-amber-600"
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

      <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-amber-700">Ballot status</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
        Already Voted
      </h1>

      <p className="mt-2 leading-6 text-slate-500">
        This student number has already been used to
        cast a vote.
      </p>

      <p className="mt-4 text-sm text-slate-400">
        Each student is allowed to vote only once.
      </p>
    </div>
  );
}

export default AlreadyVoted;
