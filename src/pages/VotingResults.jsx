import { useCallback, useEffect, useState } from "react";
import { getResults } from "../services/votingService";

function VotingResults() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadResults = useCallback(async () => {
    if (!results) setLoading(true);
    setError("");

    try {
      const result = await getResults();

      if (!result.success) {
        setError(result.message);
        return;
      }

      setResults(result.data ?? result);
      setLastUpdated(new Date());
    } catch (error) {
      console.error(error);
      setError("Unable to load the latest voting results.");
    } finally {
      setLoading(false);
    }
  }, [results]);

  useEffect(() => {
    let active = true;

    const fetchResults = async () => {
      if (!active) return;

      setLoading(true);
      setError("");

      try {
        const result = await getResults();

        if (!active) return;

        if (!result.success) {
          setError(result.message);
          return;
        }

        setResults(result.data ?? result);
        setLastUpdated(new Date());
      } catch (error) {
        console.error(error);
        if (active) {
          setError("Unable to load the latest voting results.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void fetchResults();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div role="status" className="app-canvas flex min-h-[calc(100vh-65px)] items-center justify-center">
        <div className="flex items-center gap-3 rounded-2xl bg-white/80 px-5 py-4 text-sm font-medium text-slate-600 soft-shadow">
          <span aria-hidden="true" className="h-5 w-5 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
          Loading voting results...
        </div>
      </div>
    );
  }

  if (error && !results) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="surface-card rounded-2xl p-7 text-center">
          <p className="font-medium text-red-700">{error}</p>

          <button
            type="button"
            onClick={loadResults}
            className="primary-action mt-4 rounded-xl px-5 py-3 font-semibold text-white"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-canvas min-h-[calc(100vh-65px)] px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-4xl">
        <div className="mb-9 text-center sm:mb-12">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-700">Community choice</p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Voting results
          </h1>

          <p className="mt-3 text-slate-500">
            Live public results | Voting {results.votingOpen ? "open" : "closed"}
          </p>
          {lastUpdated && <p className="mt-2 text-xs text-slate-400">Updated {lastUpdated.toLocaleTimeString()}</p>}
        </div>

        {error && <div role="alert" className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">{error} Showing the last loaded results.</div>}

        {/* Total Votes */}
        <div className="mb-6 overflow-hidden rounded-3xl bg-slate-950 p-7 text-center text-white shadow-xl shadow-slate-900/10 sm:p-9">
          <p className="text-sm font-medium text-slate-300">
            Total Votes
          </p>

          <p className="mt-2 text-5xl font-bold tracking-tight text-white">
            {results.totalVotes}
          </p>
        </div>

        {/* Project Results */}
        <div className="surface-card overflow-hidden rounded-3xl">
          <div className="border-b border-slate-100 p-6 sm:p-7">
            <h2 className="text-xl font-bold tracking-tight text-slate-950">
              Project Results
            </h2>
          </div>

          <div className="divide-y divide-gray-100">
            {[...(results.projects ?? [])]
              .sort((a, b) => b.votes - a.votes)
              .map((project, index) => (
              <div key={project.id} className="p-5 transition-colors hover:bg-slate-50/70 sm:p-7">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-4">
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl font-bold ${index === 0 ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-600"}`}>
                      {index + 1}
                    </div>

                    <div className="min-w-0">
                      <h3 className="break-words font-semibold text-slate-950">
                        {project.title}
                      </h3>

                      <p className="text-sm text-slate-500">
                        {project.group}
                      </p>
                      {project.members?.length > 0 && (
                        <p className="mt-1 text-xs leading-5 text-slate-500">Members: {project.members.join(", ")}</p>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xl font-bold tabular-nums text-slate-950">
                      {project.votes}
                    </p>

                    <p className="text-sm text-slate-500">
                      {project.percentage}%
                    </p>
                  </div>
                </div>

                {/* Vote Bar */}
                <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-500"
                    style={{
                      width: `${project.percentage}%`,
                    }}
                  />
                </div>
              </div>
              ))}
            {(results.projects ?? []).length === 0 && <p className="p-8 text-center text-gray-500">No project results are available yet.</p>}
          </div>
        </div>

        {/* Refresh */}
        <button
          type="button"
          onClick={loadResults}
          className="mt-7 w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
        >
          Refresh Results
        </button>
      </div>
    </div>
  );
}

export default VotingResults;
