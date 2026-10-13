import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import VotingResults from "./pages/VotingResults";
import StudentVerification from "./components/StudentVerification";
import VotingPage from "./pages/VotingPage";
import AdminPage from "./pages/AdminPage";
import SiteHeader from "./components/SiteHeader";

function StudentVoting() {
  const [studentNumber, setStudentNumber] = useState(null);

  return (
    <div className="app-canvas min-h-screen">
      <SiteHeader />
      <main className="px-4 py-10 sm:py-14">
        <div className="mx-auto flex min-h-[76vh] max-w-7xl items-center justify-center">
          {!studentNumber ? (
            <StudentVerification onVerified={setStudentNumber} />
          ) : (
            <VotingPage studentNumber={studentNumber} onChangeStudent={() => setStudentNumber(null)} />
          )}
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StudentVoting />} />

        <Route path="/admin" element={<><SiteHeader /><AdminPage /></>} />
        <Route path="/results" element={<><SiteHeader /><VotingResults /></>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
