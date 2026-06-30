import { google } from "googleapis";

const isConfigured = () =>
  Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_REFRESH_TOKEN);

const getCalendarClient = () => {
  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );
  auth.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
  return google.calendar({ version: "v3", auth });
};

export const createMeetEvent = async ({ title, description, startISO, endISO, attendeeEmails }) => {
  if (!isConfigured()) {
    console.warn("Google Calendar not configured — skipping Meet event creation.");
    return { eventId: "", meetLink: "" };
  }

  const calendar = getCalendarClient();
  const response = await calendar.events.insert({
    calendarId: process.env.GOOGLE_CALENDAR_ID || "primary",
    conferenceDataVersion: 1,
    resource: {
      summary: title,
      description,
      start: { dateTime: startISO },
      end: { dateTime: endISO },
      attendees: attendeeEmails.filter(Boolean).map((email) => ({ email })),
      conferenceData: {
        createRequest: {
          requestId: `medicare-${Date.now()}`,
          conferenceSolutionKey: { type: "hangoutsMeet" }
        }
      }
    }
  });

  const entryPoint = response.data.conferenceData?.entryPoints?.find(
    (point) => point.entryPointType === "video"
  );

  return {
    eventId: response.data.id || "",
    meetLink: entryPoint?.uri || response.data.hangoutLink || ""
  };
};

export const deleteMeetEvent = async (calendarEventId) => {
  if (!calendarEventId || !isConfigured()) {
    return;
  }

  const calendar = getCalendarClient();

  await calendar.events
    .delete({
      calendarId: process.env.GOOGLE_CALENDAR_ID || "primary",
      eventId: calendarEventId
    })
    .catch((error) => {
      console.warn("Failed to delete Google Calendar event:", error.message);
    });
};
