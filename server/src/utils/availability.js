const availabilityDatePattern = /^\d{4}-\d{2}-\d{2}$/;
const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const isValidAvailabilityDate = (value) => availabilityDatePattern.test(value);
export const isValidTime24 = (value) => timePattern.test(value);

export const toMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

export const formatDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const formatTimeLabel = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  const suffix = hours >= 12 ? "PM" : "AM";
  const normalizedHours = hours % 12 || 12;
  return `${String(normalizedHours).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${suffix}`;
};

export const validateAvailabilitySlot = (slot) => {
  if (!slot || typeof slot !== "object") {
    return "Availability slot must be an object.";
  }

  if (!isValidAvailabilityDate(String(slot.date || ""))) {
    return "Availability date must use YYYY-MM-DD format.";
  }

  if (!isValidTime24(String(slot.startTime || ""))) {
    return "Availability start time must use HH:mm format.";
  }

  if (!isValidTime24(String(slot.endTime || ""))) {
    return "Availability end time must use HH:mm format.";
  }

  if (toMinutes(slot.startTime) >= toMinutes(slot.endTime)) {
    return "Availability end time must be later than start time.";
  }

  return null;
};

export const normalizeAvailabilitySlots = (slots = []) =>
  slots
    .map((slot) => ({
      date: String(slot.date),
      startTime: String(slot.startTime),
      endTime: String(slot.endTime),
      isAvailable: slot.isAvailable !== false,
      note: String(slot.note || "").trim()
    }))
    .sort((left, right) => {
      if (left.date !== right.date) {
        return left.date.localeCompare(right.date);
      }

      return toMinutes(left.startTime) - toMinutes(right.startTime);
    });

export const hasOverlappingAvailabilitySlots = (slots = []) => {
  const normalizedSlots = normalizeAvailabilitySlots(slots);

  for (let index = 1; index < normalizedSlots.length; index += 1) {
    const previous = normalizedSlots[index - 1];
    const current = normalizedSlots[index];

    if (previous.date !== current.date) {
      continue;
    }

    if (toMinutes(previous.endTime) > toMinutes(current.startTime)) {
      return true;
    }
  }

  return false;
};

export const getNextAvailabilityText = (slots = [], referenceDate = new Date()) => {
  const referenceKey = formatDateKey(referenceDate);
  const referenceMinutes = referenceDate.getHours() * 60 + referenceDate.getMinutes();

  const nextSlot = normalizeAvailabilitySlots(slots).find((slot) => {
    if (!slot.isAvailable) {
      return false;
    }

    if (slot.date > referenceKey) {
      return true;
    }

    return slot.date === referenceKey && toMinutes(slot.endTime) > referenceMinutes;
  });

  if (!nextSlot) {
    return "No availability added yet";
  }

  return `Next slot: ${formatTimeLabel(nextSlot.startTime)} on ${nextSlot.date}`;
};

export const isAppointmentWithinAvailability = (appointmentDate, slots = []) => {
  const appointmentKey = formatDateKey(appointmentDate);
  const appointmentMinutes = appointmentDate.getHours() * 60 + appointmentDate.getMinutes();

  return normalizeAvailabilitySlots(slots).some((slot) => {
    if (!slot.isAvailable || slot.date !== appointmentKey) {
      return false;
    }

    const slotStart = toMinutes(slot.startTime);
    const slotEnd = toMinutes(slot.endTime);

    return appointmentMinutes >= slotStart && appointmentMinutes < slotEnd;
  });
};
