import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Doctors from "./pages/Doctors";
import Register from "./pages/Register";
import "./App.css";

function App() {
  const [activePage, setActivePage] = useState("doctors");

  return (
    <div className="app-shell">
      <Navbar activePage={activePage} onNavigate={setActivePage} />
      <main className="app-main">
        {activePage === "doctors" && <Doctors activePage={activePage} />}
        {activePage === "register" && <Register />} 
      </main>
    </div>
  );
}

export default App;