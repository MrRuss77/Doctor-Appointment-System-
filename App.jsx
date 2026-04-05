import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Doctors from "./pages/Doctors";
import "./App.css";

function App() {
  const [activePage, setActivePage] = useState("doctors");

  return (
    <div className="app-shell">
      <Navbar activePage={activePage} onNavigate={setActivePage} />
      <main className="app-main">
        <Doctors activePage={activePage} />
      </main>
    </div>
  );
}

export default App;
