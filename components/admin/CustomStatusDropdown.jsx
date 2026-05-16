import React, { useState, useEffect, useRef } from "react";

export const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "rejected", label: "Rejected" },
  { value: "cancelled", label: "Cancelled" },
  { value: "completed", label: "Completed" }
];

const CustomStatusDropdown = ({ value, onChange, disabled, compact, options, filterPending = true }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentOptions = options || STATUS_OPTIONS;
  const currentOption = currentOptions.find((opt) => opt.value === value) || { value, label: "Pending" };

  return (
    <div
      className={`admin-status-dropdown ${compact ? "admin-status-dropdown--compact" : ""} ${value} custom-dropdown-wrapper ${disabled ? "disabled" : ""} ${isOpen ? "open" : ""}`}
      ref={dropdownRef}
      onClick={() => !disabled && setIsOpen(!isOpen)}
    >
      <div className="custom-dropdown-trigger">
        {currentOption.label}
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>
      {isOpen && (
        <div className="custom-dropdown-menu">
          {(filterPending && !options ? currentOptions.filter(opt => opt.value !== "pending") : currentOptions).map((option) => (
            <div
              key={option.value}
              className={`custom-dropdown-item ${option.value === value ? "selected" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                if (!disabled) {
                  onChange(option.value);
                  setIsOpen(false);
                }
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomStatusDropdown;
