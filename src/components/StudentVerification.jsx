import { useState } from "react";
import { verifyStudent } from "../services/votingService";

function StudentVerification({ onVerified }) {
  const [studentNumber, setStudentNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          IoT Project Voting
        </h1>

        <p className="mt-2 text-gray-500">
          Verify your student number to continue.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <label
          htmlFor="studentNumber"
          className="mb-2 block text-sm font-medium text-gray-700"
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
          placeholder="e.g. 2024-00001"
          disabled={loading}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100"
        />

        {error && (
          <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3">
            <p className="text-sm font-medium text-red-700">
              {error}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {loading ? "Verifying..." : "Continue"}
        </button>
      </form>
    </div>
  );
}

export default StudentVerification;