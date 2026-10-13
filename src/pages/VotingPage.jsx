import { useCallback, useEffect, useState } from "react";
import ProjectCard from "../components/ProjectCard";
import VoteConfirmation from "../components/VoteConfirmation";
import VoteSuccess from "../components/VoteSuccess";
import AlreadyVoted from "../components/AlreadyVoted";
import { getResults, submitVote } from "../services/votingService";

function VotingPage({ studentNumber, onChangeStudent }) {
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [votingOpen, setVotingOpen] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [voteSubmitted, setVoteSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [alreadyVoted, setAlreadyVoted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadProjects = useCallback(async () => {
    setLoadingProjects(true);
    setError("");
    try {
      const result = await getResults();

      if (!result.success) {
        if (result.status === "already_voted") {
          setAlreadyVoted(true);
          return;
        }
        setError(result.message);
        return;
      }

      const data = result.data ?? result;
      setProjects(data.projects ?? []);
      setVotingOpen(data.votingOpen !== false);
    } catch (error) {
      console.error(error);
      setError("Unable to load projects.");
    } finally {
      setLoadingProjects(false);
    }
  }, []);

  useEffect(() => {
    void loadProjects();
  }, [loadProjects]);
  const handleSubmitVote = () => {
    if (!selectedProject) {
      return;
    }

    setError("");
    setShowConfirmation(true);
  };

  const handleConfirmVote = async () => {
    if (submitting) {
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      const result = await submitVote(studentNumber, selectedProject.id);

      if (!result.success) {
        setShowConfirmation(false);

        if (result.status === "already_voted") {
          setAlreadyVoted(true);
        } else if (result.status === "voting_closed") {
          setVotingOpen(false);
          setError(result.message || "Voting is currently closed.");
        } else {
          setError(result.message);
        }

        return;
      }

      setShowConfirmation(false);
      setVoteSubmitted(true);
    } catch (error) {
      console.error(error);

      setShowConfirmation(false);
      setError(error.message || "Unable to connect to the voting server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (alreadyVoted) {
    return <AlreadyVoted />;
  }

  if (voteSubmitted) {
    return <VoteSuccess project={selectedProject} />;
  }

  if (loadingProjects) {
    return (
      <div role="status" className="flex min-h-[60vh] w-full items-center justify-center">
        <div className="flex items-center gap-3 rounded-2xl bg-white/80 px-5 py-4 text-sm font-medium text-slate-600 soft-shadow">
          <span aria-hidden="true" className="h-5 w-5 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
          Loading project ballot...
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="w-full max-w-7xl py-4 sm:py-8">
        <div className="mb-8 flex flex-col gap-5 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-700">Your ballot</p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Choose your favorite project
            </h1>
            <p className="mt-2 text-slate-500">Review the project details and select one to continue.</p>
          </div>
          <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 soft-shadow sm:justify-start">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Voting as</p>
              <p className="mt-0.5 font-semibold text-slate-800">{studentNumber}</p>
            </div>
            <span className="h-8 w-px bg-slate-200" aria-hidden="true" />
            <button type="button" onClick={onChangeStudent} className="text-sm font-semibold text-blue-700 underline underline-offset-2 hover:text-blue-900">
              Change
            </button>
          </div>
        </div>

        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50/80 p-4 text-sm text-blue-950 sm:items-center">
          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-blue-700 ring-1 ring-blue-100">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M10.3 3.9 2.6 17.2A1.8 1.8 0 0 0 4.2 20h15.6a1.8 1.8 0 0 0 1.6-2.8L13.7 3.9a2 2 0 0 0-3.4 0Z" /></svg>
          </span>
          <p><span className="font-semibold">One vote per student.</span> Once submitted, your choice cannot be changed.</p>
        </div>

        {!votingOpen && (
          <div role="status" className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-center text-amber-900">
            Voting is currently closed. You can review the projects, but votes cannot be submitted.
          </div>
        )}

        {error && (
          <div role="alert" className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-center">
            <p className="font-medium text-red-700">{error}</p>
            {projects.length === 0 && (
              <button type="button" onClick={loadProjects} className="mt-3 rounded-lg bg-red-700 px-4 py-2 font-semibold text-white hover:bg-red-800">
                Retry loading projects
              </button>
            )}
          </div>
        )}

        {projects.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                selected={selectedProject?.id === project.id}
                onSelect={setSelectedProject}
              />
            ))}
          </div>
        ) : !error ? (
          <div className="surface-card rounded-2xl p-10 text-center text-slate-600">No projects are available yet.</div>
        ) : null}

        <button
          type="button"
          disabled={!selectedProject || !votingOpen || projects.length === 0}
          onClick={handleSubmitVote}
          className="primary-action mt-8 w-full rounded-xl px-5 py-4 font-semibold text-white transition sm:mx-auto sm:block sm:max-w-sm disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          Submit Vote
        </button>
      </div>

      {showConfirmation && selectedProject && (
        <VoteConfirmation
          project={selectedProject}
          submitting={submitting}
          onCancel={() => setShowConfirmation(false)}
          onConfirm={handleConfirmVote}
        />
      )}
    </>
  );
}

export default VotingPage;
