export const sendSuccess = (res, { status = 200, message = "Request successful.", data, meta } = {}) => {
  const payload = {
    success: true,
    message
  };

  if (typeof data !== "undefined") {
    payload.data = data;
  }

  if (typeof meta !== "undefined") {
    payload.meta = meta;
  }

  return res.status(status).json(payload);
};

