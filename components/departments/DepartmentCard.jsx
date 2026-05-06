import React from "react";

const DepartmentCard = ({ department, onSelectDepartment }) => {
  return (
    <button
      type="button"
      className="department-card department-card--modern"
      onClick={() => onSelectDepartment?.(department.name)}
    >
      <span
        className="department-card__badge department-card__badge--emoji"
        style={{ "--department-accent": department.accent }}
        aria-hidden="true"
      >
        {department.emoji}
      </span>
      <span className="department-card__title">{department.name}</span>
    </button>
  );
};

export default DepartmentCard;
