import React, { useState } from "react";
import DepartmentCard from "./DepartmentCard";

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="department-search__icon">
    <path
      d="M10.5 4a6.5 6.5 0 1 0 4.03 11.6l4.44 4.44 1.41-1.41-4.44-4.44A6.5 6.5 0 0 0 10.5 4Zm0 2a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Z"
      fill="currentColor"
    />
  </svg>
);

const DepartmentPanel = ({ departments, onSelectDepartment }) => {
  const [departmentSearch, setDepartmentSearch] = useState("");

  const filteredDepartments = departments.filter((department) =>
    department.name.toLowerCase().includes(departmentSearch.toLowerCase())
  );

  return (
    <div className="departments-panel">
      <div className="department-page-shell">
        <div className="department-search department-search--soft">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search Departments..."
            value={departmentSearch}
            onChange={(event) => setDepartmentSearch(event.target.value)}
          />
        </div>

        <p className="department-page-shell__intro">
          Comprehensive healthcare services across multiple specialties
        </p>

        <div className="department-grid department-grid--modern">
          {filteredDepartments.map((department, index) => (
            <DepartmentCard
              key={`${department.name}-${index}`}
              department={department}
              onSelectDepartment={onSelectDepartment}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DepartmentPanel;
