import "dotenv/config";

interface IEnv {
  PORT: string;
  MONGO_URI: string;
  NODE_ENV: string;
  BCRYPT_SALT: string;
  JWT_SECRET: string;
  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
  FRONTEND_URL: string;
}

type ENV_KEYS = keyof IEnv;

const REQUIRED_ENV: ENV_KEYS[] = [
  "PORT",
  "MONGO_URI",
  "NODE_ENV",
  "BCRYPT_SALT",
  "JWT_SECRET",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "FRONTEND_URL",
];

const loadEnv = (): IEnv => {
  const env = {} as IEnv;

  for (const key of REQUIRED_ENV) {
    const value = process.env[key];
    if (!value) {
      throw new Error(`Missing required ENV: ${key}`);
    }
    env[key] = value;
  }

  return env;
};

const env = Object.freeze(loadEnv());

export default env;
