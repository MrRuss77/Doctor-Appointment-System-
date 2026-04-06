import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Doctors from "./pages/Doctors";
import Home from "./pages/Home";
import "./App.css";

function App() {
  const [activePage, setActivePage] = useState("home");

  return (
    <div className="app-shell">
      <Navbar activePage={activePage} onNavigate={setActivePage} />
      <main className="app-main">
        {activePage === "home" ? (
          <Home />
        ) : (
          <Doctors activePage={activePage} />
        )}
      </main>
    </div>
  );
}

export default App;
