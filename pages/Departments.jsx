import React from "react";
import DepartmentPanel from "../components/departments/DepartmentPanel";
import cardiacImage from "../components/departments/cardiac.png.png";
import dentistImage from "../components/departments/dentist.png.png";
import gynecologistImage from "../components/departments/gynecologist.png.png";
import psychiatristImage from "../components/departments/psychiatrist.png.png";

const departmentData = [
  { name: "Anesthiology", image: dentistImage },
  { name: "Dentist", image: dentistImage },
  { name: "Physiacrist", image: psychiatristImage },
  { name: "Gynocologist", image: gynecologistImage },
  { name: "Cardiac", image: cardiacImage },
  { name: "Dentist", image: dentistImage },
  { name: "Physiacrist", image: psychiatristImage },
  { name: "Dentist", image: dentistImage },
  { name: "Dentist", image: dentistImage }
];

const Departments = () => {
  return <DepartmentPanel departments={departmentData} />;
};

export default Departments;
