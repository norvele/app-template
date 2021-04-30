export const name = {
  type: "string",
  maxLength: 32,
} as const;

export const email = {
  type: "string",
  format: "email",
  maxLength: 32,
} as const;

export const password = {
  type: "string",
  minLength: 8,
  maxLength: 32,
} as const;
