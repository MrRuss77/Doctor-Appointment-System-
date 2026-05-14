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

const unwrapPayload = (payload) => {
  if (
    payload &&
    typeof payload === "object" &&
    payload.success === true &&
    Object.prototype.hasOwnProperty.call(payload, "data")
  ) {
    if (payload.data && typeof payload.data === "object" && !Array.isArray(payload.data)) {
      return {
        ...payload.data,
        message: payload.message,
        success: payload.success
      };
    }

    return {
      data: payload.data,
      message: payload.message,
      success: payload.success
    };
  }

  return payload;
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

  return unwrapPayload(payload);
};

const withQuery = (path, params = {}) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === null || typeof value === "undefined" || value === "") {
      return;
    }

    query.set(key, String(value));
  });

  const queryString = query.toString();
  return queryString ? `${path}?${queryString}` : path;
};

export const fetchDoctors = async (query = "") => {
  const trimmedQuery = query.trim();
  const path = trimmedQuery
    ? `/doctors/search?q=${encodeURIComponent(trimmedQuery)}`
    : "/doctors";

  return request(path);
};
export const fetchDepartments = async () => request("/departments");
export const fetchAppointments = async (filters = {}) => request(withQuery("/appointments", filters));
export const fetchUsers = async () => request("/users");
export const fetchAppointment = async (appointmentId) => request(`/appointments/${appointmentId}`);
export const fetchDoctorAvailability = async (doctorId) => request(`/doctors/${doctorId}/availability`);

export const createUser = async (body) =>
  request("/users", {
    method: "POST",
    body: JSON.stringify(body)
  });

export const updateUser = async (userId, body) =>
  request(`/users/${userId}`, {
    method: "PUT",
    body: JSON.stringify(body)
  });

export const deleteUser = async (userId) =>
  request(`/users/${userId}`, {
    method: "DELETE"
  });

export const createDoctor = async (body) =>
  request("/doctors", {
    method: "POST",
    body: JSON.stringify(body)
  });

export const updateDoctor = async (doctorId, body) =>
  request(`/doctors/${doctorId}`, {
    method: "PUT",
    body: JSON.stringify(body)
  });

export const deleteDoctor = async (doctorId) =>
  request(`/doctors/${doctorId}`, {
    method: "DELETE"
  });

export const addDoctorAvailability = async (doctorId, body) =>
  request(`/doctors/${doctorId}/availability`, {
    method: "POST",
    body: JSON.stringify(body)
  });

export const replaceDoctorAvailability = async (doctorId, body) =>
  request(`/doctors/${doctorId}/availability`, {
    method: "PUT",
    body: JSON.stringify(body)
  });

export const updateDoctorAvailabilitySlot = async (doctorId, slotId, body) =>
  request(`/doctors/${doctorId}/availability/${slotId}`, {
    method: "PUT",
    body: JSON.stringify(body)
  });

export const deleteDoctorAvailabilitySlot = async (doctorId, slotId) =>
  request(`/doctors/${doctorId}/availability/${slotId}`, {
    method: "DELETE"
  });

export const createDepartment = async (body) =>
  request("/departments", {
    method: "POST",
    body: JSON.stringify(body)
  });

export const updateDepartment = async (departmentId, body) =>
  request(`/departments/${departmentId}`, {
    method: "PUT",
    body: JSON.stringify(body)
  });

export const deleteDepartment = async (departmentId) =>
  request(`/departments/${departmentId}`, {
    method: "DELETE"
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

export const respondToAppointment = async (appointmentId, body) =>
  request(`/appointments/${appointmentId}/respond`, {
    method: "PUT",
    body: JSON.stringify(body)
  });

export const deleteAppointment = async (appointmentId) =>
  request(`/appointments/${appointmentId}`, {
    method: "DELETE"
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
