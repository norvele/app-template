export const envSchema = {
  type: "object",
  required: [
    "DB_CONNECTION_STRING",
    "MAIL_HOST",
    "MAIL_PORT",
    "MAIL_USER",
    "MAIL_PASS",
    "MAIL_FROM",
  ],
  properties: {
    DB_CONNECTION_STRING: {
      type: "string",
    },
    MAIL_HOST: {
      type: "string",
    },
    MAIL_PORT: {
      type: "number",
    },
    MAIL_USER: {
      type: "string",
    },
    MAIL_PASS: {
      type: "string",
    },
    MAIL_FROM: {
      type: "string",
    },
  },
} as const;
