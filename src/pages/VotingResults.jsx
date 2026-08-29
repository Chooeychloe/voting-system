import { useCallback, useEffect, useState } from "react";
import { getResults } from "../services/votingService";

function VotingResults() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadResults = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await getResults();

      if (!result.success) {
        setError(result.message);
        return;
      }

      setResults(result.data);
    } catch (error) {
      console.error(error);
      setError("Unable to load the latest voting results.");
    } finally {
      setLoading(false);
    }
  }, []);

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

        setResults(result.data);
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
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading latest results...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="rounded-xl bg-red-50 p-6 text-center">
          <p className="font-medium text-red-700">{error}</p>

          <button
            type="button"
            onClick={loadResults}
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Latest Voting Results
          </h1>

          <p className="mt-2 text-gray-500">
            Thank you for voting!
          </p>
        </div>

        {/* Total Votes */}
        <div className="mb-6 rounded-xl bg-white p-6 text-center shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Total Votes
          </p>

          <p className="mt-2 text-4xl font-bold text-gray-900">
            {results.totalVotes}
          </p>
        </div>

        {/* Project Results */}
        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900">
              Project Results
            </h2>
          </div>

          <div className="divide-y divide-gray-100">
            {results.projects.map((project, index) => (
              <div key={project.id} className="p-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 font-bold text-gray-600">
                      {index + 1}
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {project.title}
                      </h3>

                      <p className="text-sm text-gray-500">
                        {project.group}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900">
                      {project.votes}
                    </p>

                    <p className="text-sm text-gray-500">
                      {project.percentage}%
                    </p>
                  </div>
                </div>

                {/* Vote Bar */}
                <div className="mt-4 h-3 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all"
                    style={{
                      width: `${project.percentage}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Refresh */}
        <button
          type="button"
          onClick={loadResults}
          className="mt-6 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-700 hover:bg-gray-50"
        >
          Refresh Results
        </button>
      </div>
    </div>
  );
}

export default VotingResults;