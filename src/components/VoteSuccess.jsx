import { useNavigate } from "react-router-dom";

function VoteSuccess({ project }) {
  const navigate = useNavigate();
  return (
    <div className="surface-card w-full max-w-lg rounded-3xl p-8 text-center sm:p-10">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 ring-1 ring-emerald-100">
        <svg
          className="h-8 w-8 text-emerald-600"
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

      <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Ballot recorded</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
        Vote Submitted!
      </h1>

      <p className="mt-2 text-slate-500">
        Thank you for participating in the IoT Project Voting.
      </p>

      <div className="mt-7 rounded-2xl border border-slate-100 bg-slate-50 p-5">
        <p className="text-sm text-slate-500">
          Your vote was recorded for
        </p>

        <p className="mt-1 font-semibold text-slate-950">
          {project.title}
        </p>

        <p className="mt-1 text-sm font-medium text-blue-700">
          {project.group}
        </p>
      </div>

      <button
        type="button"
        onClick={() => navigate("/results")}
        className="primary-action mt-7 w-full rounded-xl px-4 py-3.5 font-semibold text-white transition"
      >
        Done
      </button>
    </div>
  );
}

export default VoteSuccess;
