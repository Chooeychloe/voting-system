import useDialogAccessibility from "../hooks/useDialogAccessibility";

function VotingStatusConfirmation({
  isOpen,
  opening,
  onCancel,
  onConfirm,
  loading = false,
}) {
  const dialogRef = useDialogAccessibility(isOpen, onCancel, !loading);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 py-6 backdrop-blur-sm">
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="voting-status-title" tabIndex={-1} className="surface-card w-full max-w-md rounded-3xl p-6 sm:p-7">
        {/* Icon */}
        <div
          className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${
            opening ? "bg-green-100" : "bg-red-100"
          }`}
        >
          {opening ? (
            <svg
              className="h-7 w-7 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <svg
              className="h-7 w-7 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z"
              />
            </svg>
          )}
        </div>

        {/* Title */}
        <h2 id="voting-status-title" className="mt-5 text-center text-2xl font-bold tracking-tight text-slate-950">
          {opening ? "Open Voting?" : "Close Voting?"}
        </h2>

        {/* Message */}
        <p className="mt-3 text-center leading-relaxed text-slate-500">
          {opening
            ? "Are you sure you want to open the voting? Students will be able to submit their votes."
            : "Are you sure you want to close the voting? Students will no longer be able to submit votes."}
        </p>

        {/* Buttons */}
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 rounded-xl px-4 py-3 font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
              opening
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {loading
              ? "Updating..."
              : opening
                ? "Open Voting"
                : "Close Voting"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default VotingStatusConfirmation;
