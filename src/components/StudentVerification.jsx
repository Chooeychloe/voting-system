import { useState } from "react";
import { verifyStudent } from "../services/votingService";
import AlreadyVoted from "./AlreadyVoted";

function StudentVerification({ onVerified }) {
  const [studentNumber, setStudentNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [alreadyVoted, setAlreadyVoted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const value = studentNumber.trim();

    if (!value) {
      setError("Please enter your student number.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const result = await verifyStudent(value);

      if (!result.success) {
        if (result.status === "already_voted") {
          setAlreadyVoted(true);
          return;
        }
        setError(result.message);
        return;
      }

      onVerified(value);
    } catch (error) {
      console.error(error);

      setError(
        "Unable to connect to the voting server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (alreadyVoted) return <AlreadyVoted />;

  return (
    <div className="surface-card w-full max-w-lg rounded-3xl p-7 sm:p-10">
      <div className="mb-8 text-center">
        <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 ring-1 ring-blue-100">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-7 w-7" stroke="currentColor" strokeWidth="1.7">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3 19 6v5c0 4.5-3 7.6-7 10-4-2.4-7-5.5-7-10V6l7-3Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="m9 12 2 2 4-4" />
          </svg>
        </span>
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-700">Cast your vote</p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
          IoT Project Voting
        </h1>

        <p className="mx-auto mt-3 max-w-sm leading-6 text-slate-500">
          Enter your student number to see the projects and choose your favorite.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <label
          htmlFor="studentNumber"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Student Number
        </label>

        <input
          id="studentNumber"
          type="text"
          value={studentNumber}
          onChange={(e) =>
            setStudentNumber(e.target.value)
          }
          placeholder="e.g. 202600001"
          autoComplete="off"
          aria-invalid={Boolean(error)}
          disabled={loading}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:bg-slate-100"
        />

        {error && (
          <div role="alert" className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3">
            <p className="text-sm font-medium text-red-700">
              {error}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="primary-action mt-6 w-full rounded-xl px-4 py-3.5 font-semibold text-white transition disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {loading ? "Verifying..." : "Continue"}
        </button>
      </form>
      <p className="mt-6 text-center text-xs leading-5 text-slate-400">Your eligibility is checked against the student roster.</p>
    </div>
  );
}

export default StudentVerification;
