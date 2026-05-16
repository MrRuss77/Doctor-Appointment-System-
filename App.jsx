import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Doctors from "./pages/Doctors";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import PatientUserPage from "./pages/PatientUserPage";
import Footer from "./components/Footer";
import MediCareChat from "./src/components/MediCareChat";
import FloatingBackButton from "./components/FloatingBackButton";
import "./App.css";

function App() {
  const [activePage, setActivePage] = useState("home");
  const [previousPages, setPreviousPages] = useState([]);
  const [doctorFilter, setDoctorFilter] = useState("");
  const [authUser, setAuthUser] = useState(() => {
    try {
      const stored = localStorage.getItem("medicare_auth_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [welcomeName, setWelcomeName] = useState(() => {
    try {
      return localStorage.getItem("medicare_welcome_name") || "";
    } catch {
      return "";
    }
  });
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    if (authUser) {
      localStorage.setItem("medicare_auth_user", JSON.stringify(authUser));
      localStorage.setItem("user", JSON.stringify(authUser));
    } else {
      localStorage.removeItem("medicare_auth_user");
      localStorage.removeItem("user");
    }
  }, [authUser]);

  useEffect(() => {
    if (welcomeName) {
      localStorage.setItem("medicare_welcome_name", welcomeName);
    } else {
      localStorage.removeItem("medicare_welcome_name");
    }
  }, [welcomeName]);

  const handleNavigate = (page, options = {}) => {
    if (page === "admin" && authUser?.role !== "admin") {
      page = authUser ? "home" : "login";
    }

    if (page === "doctor" && authUser?.role !== "doctor" && authUser?.role !== "admin") {
      page = authUser ? "home" : "login";
    }

    if (page === "patient-profile" && authUser?.role !== "patient") {
      page = authUser ? "home" : "login";
    }

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

  const requestLogout = () => {
    setShowLogoutConfirm(true);
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const handleLogout = () => {
    setAuthUser(null);
    setWelcomeName("");
    setPreviousPages([]);
    setShowLogoutConfirm(false);
    setActivePage("home");
  };

  const isDashboardPage = activePage === "admin" || activePage === "doctor";
  const isLoginPage = activePage === "login";

  return (
    <div className="app-shell">
      <Navbar
        activePage={activePage}
        onNavigate={handleNavigate}
        authUser={authUser}
        onLogout={requestLogout}
      />
      <FloatingBackButton 
        onBack={handleBack} 
        show={previousPages.length > 0} 
      />

      <main
        className="app-main"
        style={
          isDashboardPage
            ? { padding: 0, width: "100%", maxWidth: "100%" }
            : {}
        }
      >
        {activePage === "admin" && authUser?.role === "admin" ? (
          <AdminDashboard authUser={authUser} onLogout={requestLogout} onBack={handleBack} />
        ) : activePage === "doctor" &&
          (authUser?.role === "doctor" || authUser?.role === "admin") ? (
          <DoctorDashboard authUser={authUser} onLogout={requestLogout} />
        ) : activePage === "patient-profile" && authUser?.role === "patient" ? (
          <PatientUserPage
            authUser={authUser}
            onBack={handleBack}
            onNavigate={handleNavigate}
          />
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

      {!isLoginPage && <Footer onNavigate={handleNavigate} />}

      {showLogoutConfirm && (
        <div className="logout-dialog" role="presentation">
          <div
            className="logout-dialog__panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-dialog-title"
          >
            <p className="logout-dialog__eyebrow">Account session</p>
            <h2 id="logout-dialog-title">Confirm logout?</h2>
            <p className="logout-dialog__text">
              You will be returned to the home page and need to sign in again to
              access your portal.
            </p>

            <div className="logout-dialog__actions">
              <button
                type="button"
                className="logout-dialog__cancel"
                onClick={cancelLogout}
              >
                Stay logged in
              </button>

              <button
                type="button"
                className="logout-dialog__confirm"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      <MediCareChat />
    </div>
  );
}

export default App;
