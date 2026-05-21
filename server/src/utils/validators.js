export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const phonePattern = /^\d{10}$/;

export const isValidEmail = (value) => emailPattern.test(value);
export const isValidPhone = (value) => phonePattern.test(String(value || "").trim());
