import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import VotingResults from "./pages/VotingResults";
import StudentVerification from "./components/StudentVerification";
import VotingPage from "./pages/VotingPage";
import AdminPage from "./pages/AdminPage";

function StudentVoting() {
  const [studentNumber, setStudentNumber] = useState(null);

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="mx-auto flex min-h-[80vh] max-w-5xl items-center justify-center">
        {!studentNumber ? (
          <StudentVerification onVerified={setStudentNumber} />
        ) : (
          <VotingPage studentNumber={studentNumber} />
        )}
      </div>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StudentVoting />} />

        <Route path="/admin" element={<AdminPage />} />
        <Route path="/results" element={<VotingResults />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
