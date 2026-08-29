function VoteSuccess({ project }) {

  const onDone = () => {
  window.location.href = "/results";
};
  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
        <svg
          className="h-8 w-8 text-green-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <h1 className="mt-6 text-2xl font-bold text-gray-900">
        Vote Submitted!
      </h1>

      <p className="mt-2 text-gray-500">
        Thank you for participating in the IoT Project Voting.
      </p>

      <div className="mt-6 rounded-xl bg-gray-50 p-4">
        <p className="text-sm text-gray-500">
          Your vote was recorded for
        </p>

        <p className="mt-1 font-semibold text-gray-900">
          {project.title}
        </p>

        <p className="mt-1 text-sm text-blue-600">
          {project.group}
        </p>
      </div>

      <button
        type="button"
        onClick={onDone}
        className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700"
      >
        Done
      </button>
    </div>
  );
}

export default VoteSuccess;
