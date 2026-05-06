export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const phonePattern = /^\+?[0-9][0-9\s-]{6,19}$/;

export const isValidEmail = (value) => emailPattern.test(value);
export const isValidPhone = (value) => phonePattern.test(value);
