import crypto from "crypto";

const KEY_LENGTH = 64;
const HASH_PREFIX = "scrypt";

export const isPasswordHash = (value = "") => String(value).startsWith(`${HASH_PREFIX}:`);

export const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(String(password), salt, KEY_LENGTH).toString("hex");
  return `${HASH_PREFIX}:${salt}:${hash}`;
};

export const verifyPassword = (password, storedPassword = "") => {
  const stored = String(storedPassword || "");

  if (!isPasswordHash(stored)) {
    return stored === String(password);
  }

  const [, salt, storedHash] = stored.split(":");

  if (!salt || !storedHash) {
    return false;
  }

  const hash = crypto.scryptSync(String(password), salt, KEY_LENGTH);
  const storedBuffer = Buffer.from(storedHash, "hex");

  return storedBuffer.length === hash.length && crypto.timingSafeEqual(storedBuffer, hash);
};
