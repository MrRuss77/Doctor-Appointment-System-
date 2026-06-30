import crypto from "crypto";

export const generateSignature = (total_amount, transaction_uuid, product_code) => {
  const message = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
  return crypto
    .createHmac("sha256", process.env.ESEWA_SECRET_KEY)
    .update(message)
    .digest("base64");
};

export const verifyEsewaPayment = async (product_code, total_amount, transaction_uuid) => {
  const url = new URL(process.env.ESEWA_VERIFY_URL);
  url.searchParams.set("product_code", product_code);
  url.searchParams.set("total_amount", total_amount);
  url.searchParams.set("transaction_uuid", transaction_uuid);

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error("eSewa verification request failed.");
  }

  return response.json();
};
