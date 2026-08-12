import { useState } from "react";
import AdminLogin from "../components/AdminLogin";
import AdminDashboard from "./AdminDashboard";

function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);

  if (!authenticated) {
    return (
      <AdminLogin
        onLogin={() => setAuthenticated(true)}
      />
    );
  }

  return <AdminDashboard />;
}

export default AdminPage;