import React from "react";

const DepartmentCard = ({ department }) => {
  return (
    <button type="button" className="department-card">
      <img className="department-card__image" src={department.image} alt={department.name} />
      <span>{department.name}</span>
    </button>
  );
};

export default DepartmentCard;
