import useDialogAccessibility from "../hooks/useDialogAccessibility";

function VoteConfirmation({
  project,
  submitting,
  onCancel,
  onConfirm,
}) {
  const dialogRef = useDialogAccessibility(true, onCancel, !submitting);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 py-6 backdrop-blur-sm">
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="vote-confirm-title" aria-describedby="vote-confirm-description" tabIndex={-1} className="surface-card w-full max-w-md rounded-3xl p-6 sm:p-7">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Final review</p>
        <h2 id="vote-confirm-title" className="text-2xl font-bold tracking-tight text-slate-950">
          Confirm Your Vote
        </h2>

        <p className="mt-2 text-slate-500">
          You are about to vote for:
        </p>

        <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-4">
          <p className="font-semibold text-slate-950">
            {project.title}
          </p>

          <p className="mt-1 text-sm font-medium text-blue-700">
            {project.group}
          </p>
        </div>

        <p id="vote-confirm-description" className="mt-5 text-sm leading-6 text-slate-500">
          You can only vote once. Your vote cannot be
          changed after submission.
        </p>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="flex-1 rounded-xl border border-slate-200 px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={submitting}
            className="primary-action flex-1 rounded-xl px-4 py-3 font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Submitting Vote..." : "Confirm Vote"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default VoteConfirmation;
