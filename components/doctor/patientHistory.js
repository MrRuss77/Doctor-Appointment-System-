const parseNoteField = (notes, label) => {
  const noteParts = String(notes || "")
    .split("|")
    .map((part) => part.trim());

  return (
    noteParts
      .find((part) => part.toLowerCase().startsWith(`${label.toLowerCase()}:`))
      ?.split(":")
      .slice(1)
      .join(":")
      .trim() || ""
  );
};

const sortByAppointmentDateAscending = (appointments = []) =>
  [...appointments].sort((left, right) => {
    const leftDate = new Date(left.appointmentDate || 0).getTime();
    const rightDate = new Date(right.appointmentDate || 0).getTime();
    return leftDate - rightDate;
  });

const formatVisitDate = (value) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not scheduled";
  }

  return date.toISOString().slice(0, 10);
};

export const buildPatientRecords = (appointments = []) => {
  const sortedAppointments = sortByAppointmentDateAscending(appointments);
  const patientMap = new Map();

  sortedAppointments.forEach((appointment) => {
    const patient = appointment.patient || {};
    const patientId = patient._id || patient.email || appointment._id;

    if (!patientMap.has(patientId)) {
      patientMap.set(patientId, {
        id: patientId,
        name: `${patient.firstName || ""} ${patient.lastName || ""}`.trim() || "Patient",
        age: parseNoteField(appointment.notes, "Age") || "Not provided",
        gender: parseNoteField(appointment.notes, "Gender") || patient.gender || "Not provided",
        bloodGroup: parseNoteField(appointment.notes, "Blood Group") || "Not provided",
        phone: parseNoteField(appointment.notes, "Phone") || patient.phone || "Not provided",
        email: patient.email || "Not provided",
        history: []
      });
    }

    const patientRecord = patientMap.get(patientId);

    patientRecord.history.push({
      appointmentId: appointment._id,
      date: formatVisitDate(appointment.appointmentDate),
      appointmentDate: appointment.appointmentDate,
      visitLabel: `Visit #${patientRecord.history.length + 1}`,
      status: String(appointment.status || "pending").toLowerCase(),
      doctorName: appointment.doctor?.fullName || "Doctor",
      patientName: `${patient.firstName || ""} ${patient.lastName || ""}`.trim() || "Patient",
      diagnosis: appointment.reason || "General consultation",
      remarks: appointment.notes || "No remarks provided.",
      feedbackEntries: Array.isArray(appointment.feedbackEntries)
        ? [...appointment.feedbackEntries].sort(
            (left, right) => new Date(right.createdAt || 0) - new Date(left.createdAt || 0)
          )
        : []
    });
  });

  return Array.from(patientMap.values()).map((patient) => ({
    ...patient,
    history: [...patient.history].sort(
      (left, right) => new Date(right.appointmentDate || 0) - new Date(left.appointmentDate || 0)
    )
  }));
};

export const findPatientRecordForAppointment = (appointments = [], appointmentId) =>
  buildPatientRecords(appointments).find((patient) =>
    patient.history.some((entry) => String(entry.appointmentId) === String(appointmentId))
  ) || null;
