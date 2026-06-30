import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Doctors from "./pages/Doctors";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import PatientUserPage from "./pages/PatientUserPage";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailure from "./pages/PaymentFailure";
import Footer from "./components/Footer";
import MediCareChat from "./src/components/MediCareChat";
import FloatingBackButton from "./components/FloatingBackButton";
import ConfirmDialog from "./components/ConfirmDialog";
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
  const [paymentAppointmentId, setPaymentAppointmentId] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("payment-success")) {
      setPaymentAppointmentId(params.get("appointmentId") || null);
      setActivePage("payment-success");
      window.history.replaceState({}, "", window.location.pathname);
    } else if (params.has("payment-failure")) {
      setActivePage("payment-failure");
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

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
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: options.instant ? "auto" : "smooth" });
    });
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
        {activePage === "payment-success" ? (
          <PaymentSuccess appointmentId={paymentAppointmentId} onNavigate={handleNavigate} />
        ) : activePage === "payment-failure" ? (
          <PaymentFailure onNavigate={handleNavigate} />
        ) : activePage === "admin" && authUser?.role === "admin" ? (
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

      <ConfirmDialog
        isOpen={showLogoutConfirm}
        eyebrow="Account session"
        title="Confirm logout?"
        message="You will be returned to the home page and need to sign in again to access your portal."
        confirmLabel="Logout"
        cancelLabel="Stay logged in"
        confirmTone="neutral"
        onCancel={cancelLogout}
        onConfirm={handleLogout}
      />

      <MediCareChat />
    </div>
  );
}

export default App;
