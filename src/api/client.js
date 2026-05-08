const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "/api").replace(/\/$/, "");

const getErrorMessage = (payload) => {
  if (!payload) {
    return "Request failed.";
  }

  if (typeof payload === "string") {
    return payload;
  }

  if (Array.isArray(payload.errors) && payload.errors.length > 0) {
    return payload.errors.join(" ");
  }

  if (payload.message) {
    return payload.message;
  }

  return "Request failed.";
};

const request = async (path, options = {}) => {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      },
      ...options
    });
  } catch (_error) {
    throw new Error(
      `Cannot reach backend at ${API_BASE_URL}. Ensure backend is running.`
    );
  }

  const text = await response.text();
  let payload = null;

  if (text) {
    try {
      payload = JSON.parse(text);
    } catch (_error) {
      payload = text;
    }
  }

  if (!response.ok) {
    throw new Error(getErrorMessage(payload));
  }

  return payload;
};

export const fetchDoctors = async (query = "") => {
  const trimmedQuery = query.trim();
  const path = trimmedQuery
    ? `/doctors/search?q=${encodeURIComponent(trimmedQuery)}`
    : "/doctors";

  return request(path);
};
export const fetchDepartments = async () => request("/departments");
export const fetchAppointments = async () => request("/appointments");
export const fetchUsers = async () => request("/users");

export const createUser = async (body) =>
  request("/users", {
    method: "POST",
    body: JSON.stringify(body)
  });

export const createAppointment = async (body) =>
  request("/appointments", {
    method: "POST",
    body: JSON.stringify(body)
  });

export const updateAppointment = async (appointmentId, body) =>
  request(`/appointments/${appointmentId}`, {
    method: "PUT",
    body: JSON.stringify(body)
  });

export const loginUser = async (body) =>
  request("/auth/login", {
    method: "POST",
    body: JSON.stringify(body)
  });

export const sendOtp = async (body) =>
  request("/auth/send-otp", {
    method: "POST",
    body: JSON.stringify(body)
  });

export const requestPasswordReset = async (body) =>
  request("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(body)
  });

export const verifyOtpCode = async (body) =>
  request("/auth/verify-otp", {
    method: "POST",
    body: JSON.stringify(body)
  });
