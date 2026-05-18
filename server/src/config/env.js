import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const configDir = path.dirname(fileURLToPath(import.meta.url));
const serverSrcDir = path.resolve(configDir, "..");
const projectRootDir = path.resolve(serverSrcDir, "../..");

export const loadEnv = () => {
  dotenv.config({ path: path.join(projectRootDir, ".env") });
};
