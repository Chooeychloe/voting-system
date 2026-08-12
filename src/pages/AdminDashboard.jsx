import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getResults, setVotingStatus } from "../services/votingService";
function AdminDashboard() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [changingStatus, setChangingStatus] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const handleVotingStatus = async () => {
    if (!results) {
      return;
    }

    const newStatus = !results.votingOpen;

    const confirmed = window.confirm(
      newStatus
        ? "Are you sure you want to open voting?"
        : "Are you sure you want to close voting?",
    );

    if (!confirmed) {
      return;
    }

    setChangingStatus(true);
    setError("");

    try {
      const result = await setVotingStatus(newStatus);

      if (!result.success) {
        setError(result.message);
        return;
      }

      await loadResults();
    } catch (error) {
      console.error(error);

      setError("Unable to change the voting status.");
    } finally {
      setChangingStatus(false);
    }
  };
  const loadResults = async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    }

    setError("");

    try {
      const result = await getResults();

      if (!result.success) {
        setError(result.message);
        return;
      }

      const data = {
        ...result.data,
        projects: [...result.data.projects].sort((a, b) => b.votes - a.votes),
      };

      setResults(data);
      setLastUpdated(new Date());

      setResults(data);
    } catch (error) {
      console.error(error);

      setError("Unable to load voting results.");
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };
  useEffect(() => {
    loadResults();

    const interval = setInterval(() => {
      loadResults(false);
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading results...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="rounded-xl bg-red-50 p-6 text-center">
          <p className="font-medium text-red-700">{error}</p>

          <button
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
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              IoT Project Voting
            </h1>

            <p className="mt-1 text-gray-500">Voting Results</p>
          </div>
          {lastUpdated && (
            <p className="mt-1 text-xs text-gray-400">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}

          <button
            onClick={loadResults}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 hover:bg-gray-50"
          >
            Refresh
          </button>
        </div>
        <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Voting Status</p>

              <div className="mt-2 flex items-center gap-3">
                <span
                  className={`h-3 w-3 rounded-full ${
                    results.votingOpen ? "bg-green-500" : "bg-red-500"
                  }`}
                />

                <span className="text-xl font-bold text-gray-900">
                  {results.votingOpen ? "Voting Open" : "Voting Closed"}
                </span>
              </div>

              <p className="mt-1 text-sm text-gray-500">
                {results.votingOpen
                  ? "Students can currently submit votes."
                  : "Students cannot submit votes."}
              </p>
            </div>

            <button
              type="button"
              onClick={handleVotingStatus}
              disabled={changingStatus}
              className={`rounded-lg px-5 py-3 font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
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
          <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Current Leader</p>

            <div className="mt-3">
              <div className="text-3xl font-bold text-gray-900">
                🏆 {results.projects[0].title}
              </div>

              <p className="mt-2 text-gray-500">
                {results.projects[0].votes}{" "}
                {results.projects[0].votes === 1 ? "vote" : "votes"}
              </p>
            </div>
          </div>
        )}
        {/* Statistics */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Registered Students</p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {results.totalStudents}
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Votes Cast</p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {results.totalVotes}
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Voter Turnout</p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {results.turnout}%
            </p>
          </div>
        </div>
        {/* Vote Chart */}
        <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Vote Distribution
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Number of votes received by each project
            </p>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={results.projects}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 10,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="title"
                  tick={{ fontSize: 12 }}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                  height={70}
                />

                <YAxis allowDecimals={false} />

                <Tooltip />

                <Bar dataKey="votes" name="Votes" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Results */}
        <div className="mt-8 rounded-xl bg-white shadow-sm">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900">Project Results</h2>
          </div>

          <div className="divide-y divide-gray-100">
            {results.projects.map((project, index) => (
              <div key={project.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${
                        index === 0
                          ? "bg-yellow-100 text-yellow-700"
                          : index === 1
                            ? "bg-gray-200 text-gray-700"
                            : index === 2
                              ? "bg-orange-100 text-orange-700"
                              : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {index === 0
                        ? "🥇"
                        : index === 1
                          ? "🥈"
                          : index === 2
                            ? "🥉"
                            : index + 1}
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {project.title}
                      </h3>

                      <p className="text-sm text-gray-500">{project.group}</p>
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

                {/* Vote bar */}
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
      </div>
    </div>
  );
}

export default AdminDashboard;
