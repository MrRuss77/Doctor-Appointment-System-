import React, { useState, useEffect } from "react";
import LoginPanel from "./LoginPanel";
import Register from "./Register";

const SwitchContainer = ({ initialView = "login" }) => {
  const [activeView, setActiveView] = useState(initialView);

  useEffect(() => {
    setActiveView(initialView);
  }, [initialView]);

  return (
    <>
      {activeView === "login" ? (
        <LoginPanel
          onRegister={() => setActiveView("register")}
          onForgotPassword={() => setActiveView("forgot")}
        />
      ) : (
        <Register onBackToLogin={() => setActiveView("login")} />
      )}
    </>
  );
};

export default SwitchContainer;