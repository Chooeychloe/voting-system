import { useState } from "react";

function StudentNumberForm({ onContinue }) {
  const [studentNumber, setStudentNumber] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedNumber = studentNumber.trim();

    if (!trimmedNumber) {
      setError("Please enter your student number.");
      return;
    }

    setError("");
    onContinue(trimmedNumber);
  };

  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          IoT Project Voting
        </h1>

        <p className="mt-2 text-gray-500">
          Enter your student number to continue.
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
          onChange={(e) => setStudentNumber(e.target.value)}
          placeholder="e.g. 202600001"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />

        {error && (
          <p className="mt-2 text-sm text-red-500">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          Continue
        </button>
      </form>
    </div>
  );
}

export default StudentNumberForm;