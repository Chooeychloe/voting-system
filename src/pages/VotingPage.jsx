import { useEffect, useState } from "react";
import ProjectCard from "../components/ProjectCard";
import VoteConfirmation from "../components/VoteConfirmation";
import VoteSuccess from "../components/VoteSuccess";
import AlreadyVoted from "../components/AlreadyVoted";
import { getResults, submitVote } from "../services/votingService";

function VotingPage({ studentNumber }) {
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [voteSubmitted, setVoteSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [alreadyVoted, setAlreadyVoted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
  const loadProjects = async () => {
    try {
      const result = await getResults();

      if (!result.success) {
        setError(result.message);
        return;
      }

      setProjects(result.data.projects);
    } catch (error) {
      console.error(error);
      setError("Unable to load projects.");
    } finally {
      setLoadingProjects(false);
    }
  };

  loadProjects();
}, []);
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
      setError("Unable to connect to the voting server. Please try again.");
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
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-gray-500">
        Loading projects...
      </p>
    </div>
  );
}
  return (
    <>
      <div className="w-full max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Choose Your Favorite Project
          </h1>

          <p className="mt-2 text-gray-500">
            Student Number:{" "}
            <span className="font-semibold text-gray-700">{studentNumber}</span>
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-center">
            <p className="font-medium text-red-700">{error}</p>
          </div>
        )}

        <div className="grid gap-4">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              selected={selectedProject?.id === project.id}
              onSelect={setSelectedProject}
            />
          ))}
        </div>

        <button
          type="button"
          disabled={!selectedProject}
          onClick={handleSubmitVote}
          className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
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
