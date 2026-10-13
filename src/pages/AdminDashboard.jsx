import { useCallback, useEffect, useRef, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import VotingStatusConfirmation from "../components/VotingStatusConfirmation";
import { getResults, setVotingStatus } from "../services/votingService";
function AdminDashboard({ adminPassword, onLogout }) {
  const [results, setResults] = useState(null);
  const hasResultsRef = useRef(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [changingStatus, setChangingStatus] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [showStatusConfirmation, setShowStatusConfirmation] = useState(false);
  const [newVotingStatus, setNewVotingStatus] = useState(false);
  const handleVotingStatus = () => {
    if (!results) {
      return;
    }

    setNewVotingStatus(!results.votingOpen);
    setShowStatusConfirmation(true);
  };
  const confirmVotingStatus = async () => {
    setChangingStatus(true);
    setError("");

    try {
      const result = await setVotingStatus(newVotingStatus, adminPassword);

      if (!result.success) {
        setError(result.message);
        setShowStatusConfirmation(false);
        return;
      }

      setShowStatusConfirmation(false);

      await loadResults();
    } catch (error) {
      console.error(error);

      setError("Unable to change the voting status.");
      setShowStatusConfirmation(false);
    } finally {
      setChangingStatus(false);
    }
  };
  const loadResults = useCallback(async (showLoading = true) => {
    if (showLoading && !hasResultsRef.current) {
      setLoading(true);
    }

    setError("");

    try {
      const result = await getResults();

      if (!result.success) {
        setError(result.message);
        return;
      }

      const responseData = result.data ?? result;
      const data = {
        ...responseData,
        projects: [...(responseData.projects ?? [])].sort((a, b) => b.votes - a.votes),
      };

      setResults(data);
      hasResultsRef.current = true;
      setLastUpdated(new Date());
    } catch (error) {
      console.error(error);

      setError("Unable to load voting results.");
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }, []);
  useEffect(() => {
    void loadResults();

    const interval = setInterval(() => {
      loadResults(false);
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, [loadResults]);

  if (loading) {
    return (
      <div role="status" className="app-canvas flex min-h-[calc(100vh-65px)] items-center justify-center">
        <div className="flex items-center gap-3 rounded-2xl bg-white/80 px-5 py-4 text-sm font-medium text-slate-600 soft-shadow">
          <span aria-hidden="true" className="h-5 w-5 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
          Loading dashboard...
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
    <>
      <div className="app-canvas min-h-[calc(100vh-65px)] px-4 py-8 sm:px-6 sm:py-10">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-950">
                Admin dashboard
              </h1>

              <p className="mt-1 text-slate-500">Election controls and live results</p>
            </div>
            {lastUpdated && (
              <p className="mt-1 text-xs text-gray-400">
                Updated {lastUpdated.toLocaleTimeString()}
              </p>
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={loadResults}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Refresh
              </button>
              <button type="button" onClick={onLogout} className="rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-900">
                Log out
              </button>
            </div>
          </div>
          {error && (
            <div role="alert" className="mb-6 flex items-center justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              <span>{error}</span>
              <button type="button" onClick={loadResults} className="shrink-0 font-semibold underline">Retry</button>
            </div>
          )}
          <div className="surface-card mb-6 rounded-2xl p-6 sm:p-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Voting Status
                </p>

                <div className="mt-2 flex items-center gap-3">
                  <span
                    className={`h-3 w-3 rounded-full ${
                      results.votingOpen ? "bg-green-500" : "bg-red-500"
                    }`}
                  />

                  <span className="text-xl font-bold tracking-tight text-slate-950">
                    {results.votingOpen ? "Voting Open" : "Voting Closed"}
                  </span>
                </div>

                <p className="mt-1 text-sm text-slate-500">
                  {results.votingOpen
                    ? "Students can currently submit votes."
                    : "Students cannot submit votes."}
                </p>
              </div>

              <button
                type="button"
                onClick={handleVotingStatus}
                disabled={changingStatus}
                className={`rounded-xl px-5 py-3 font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
                  results.votingOpen
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {changingStatus
                  ? "Updating..."
                  : results.votingOpen
                    ? "Close Voting"
                    : "Open Voting"}
              </button>
            </div>
          </div>
          {results?.totalVotes > 0 && results?.projects?.length > 0 && (
            <div className="surface-card mb-6 rounded-2xl p-6 sm:p-7">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Current Leader
              </p>

              <div className="mt-3">
                <div className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                  {results.projects[0].title}
                </div>

                <p className="mt-2 text-slate-500">
                  {results.projects[0].votes}{" "}
                  {results.projects[0].votes === 1 ? "vote" : "votes"}
                </p>
              </div>
            </div>
          )}
          {/* Statistics */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="surface-card rounded-2xl p-6">
              <p className="text-sm font-medium text-slate-500">Registered Students</p>

              <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                {results.totalStudents}
              </p>
            </div>

            <div className="surface-card rounded-2xl p-6">
              <p className="text-sm font-medium text-slate-500">Votes Cast</p>

              <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                {results.totalVotes}
              </p>
            </div>

            <div className="surface-card rounded-2xl p-6">
              <p className="text-sm font-medium text-slate-500">Voter Turnout</p>

              <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                {results.turnout}%
              </p>
            </div>
          </div>
          {/* Vote Chart */}
          <div className="surface-card mt-8 rounded-2xl p-6 sm:p-7">
            <div className="mb-6">
              <h2 className="text-xl font-bold tracking-tight text-slate-950">
                Vote Distribution
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Number of votes received by each project
              </p>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={results.projects}
                  margin={{
                    top: 10,
                    right: 24,
                    left: 0,
                    bottom: 10,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />

                  <XAxis
                    type="number"
                    allowDecimals={false}
                    tick={{ fontSize: 12, fill: "#64748b" }}
                  />

                  <YAxis
                    type="category"
                    dataKey="title"
                    width={150}
                    tick={{ fontSize: 12, fill: "#475569" }}
                  />

                  <Tooltip />

                  <Bar dataKey="votes" name="Votes" fill="#2563eb" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* Results */}
          <div className="surface-card mt-8 overflow-hidden rounded-2xl">
            <div className="border-b border-slate-100 p-6 sm:p-7">
              <h2 className="text-xl font-bold tracking-tight text-slate-950">
                Project Results
              </h2>
            </div>

            <div className="divide-y divide-slate-100">
              {results.projects.map((project, index) => (
                <div key={project.id} className="p-5 transition-colors hover:bg-slate-50/70 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex min-w-0 items-center gap-4">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${
                          index === 0
                            ? "bg-amber-100 text-amber-800"
                            : index === 1
                              ? "bg-slate-200 text-slate-700"
                              : index === 2
                                ? "bg-orange-100 text-orange-800"
                                : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {index + 1}
                      </div>

                      <div className="min-w-0">
                        <h3 className="break-words font-semibold text-slate-950">
                          {project.title}
                        </h3>

                        <p className="text-sm text-slate-500">{project.group}</p>
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

                  {/* Vote bar */}
                  <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-500"
                      style={{
                        width: `${project.percentage}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
              {results.projects.length === 0 && <p className="p-8 text-center text-gray-500">No projects are available yet.</p>}
            </div>
          </div>
        </div>
      </div>

      <VotingStatusConfirmation
        isOpen={showStatusConfirmation}
        opening={newVotingStatus}
        loading={changingStatus}
        onCancel={() => setShowStatusConfirmation(false)}
        onConfirm={confirmVotingStatus}
      />
    </>
  );
}

export default AdminDashboard;
