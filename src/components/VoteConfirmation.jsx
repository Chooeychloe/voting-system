function VoteConfirmation({
  project,
  submitting,
  onCancel,
  onConfirm,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-xl font-bold text-gray-900">
          Confirm Your Vote
        </h2>

        <p className="mt-2 text-gray-500">
          You are about to vote for:
        </p>

        <div className="mt-5 rounded-xl bg-gray-50 p-4">
          <p className="font-semibold text-gray-900">
            {project.title}
          </p>

          <p className="mt-1 text-sm text-blue-600">
            {project.group}
          </p>
        </div>

        <p className="mt-5 text-sm text-gray-500">
          You can only vote once. Your vote cannot be
          changed after submission.
        </p>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={submitting}
            className="flex-1 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {submitting ? "Submitting Vote..." : "Confirm Vote"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default VoteConfirmation;