import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Doctors from "./pages/Doctors";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import "./App.css";

function App() {
  const [activePage, setActivePage] = useState("home");
  const [previousPages, setPreviousPages] = useState([]);
  const [doctorFilter, setDoctorFilter] = useState("");
  const [authUser, setAuthUser] = useState(null);
  const [welcomeName, setWelcomeName] = useState("");

  const handleNavigate = (page, options = {}) => {
    if (page !== activePage) {
      setPreviousPages((prev) => [...prev, activePage]);
    }
    setActivePage(page);
    setDoctorFilter(page === "doctors" ? options.department || "" : "");
  };

  const handleBack = () => {
    if (previousPages.length > 0) {
      const prev = previousPages[previousPages.length - 1];
      setPreviousPages((curr) => curr.slice(0, -1));
      setActivePage(prev);
    } else {
      setActivePage("home");
    }
  };

  const handleLoginSuccess = (user) => {
    const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
    setAuthUser(user);
    setWelcomeName(fullName || "User");
    setPreviousPages([]);
    setActivePage("home");
  };

  const handleLogout = () => {
    setAuthUser(null);
    setWelcomeName("");
    setPreviousPages([]);
    setActivePage("home");
  };

  return (
    <div className="app-shell">
      <Navbar
        activePage={activePage}
        onNavigate={handleNavigate}
        authUser={authUser}
        onLogout={handleLogout}
      />
      <main className="app-main" style={activePage === "admin" || activePage === "doctor" ? { padding: 0, width: "100%", maxWidth: "100%" } : {}}>
        {activePage === "admin" ? (
          <AdminDashboard onLogout={handleLogout} onBack={handleBack} />
        ) : activePage === "doctor" ? (
          <DoctorDashboard onLogout={handleLogout} onBack={handleBack} />
        ) : activePage === "home" ? (
          <Home
            onNavigate={handleNavigate}
            authUser={authUser}
            welcomeName={welcomeName}
          />
        ) : (
          <Doctors
            activePage={activePage}
            onNavigate={handleNavigate}
            doctorFilter={doctorFilter}
            authUser={authUser}
            onLoginSuccess={handleLoginSuccess}
            onBack={handleBack}
          />
        )}
      </main>
    </div>
  );
}

export default App;
