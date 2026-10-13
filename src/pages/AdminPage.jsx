import { useState } from "react";
import AdminLogin from "../components/AdminLogin";
import AdminDashboard from "./AdminDashboard";

function AdminPage() {
  const [adminPassword, setAdminPassword] = useState("");

  if (!adminPassword) {
    return (
      <AdminLogin
        onLogin={setAdminPassword}
      />
    );
  }

  return <AdminDashboard adminPassword={adminPassword} onLogout={() => setAdminPassword("")} />;
}

export default AdminPage;
