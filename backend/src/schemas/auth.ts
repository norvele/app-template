import { getErrorSchema } from "@/schemas/error";
import { name, email, password } from "@/schemas/properties";

export enum errorCodes {
  userAlreadyExists = "userAlreadyExists",
  invalidPassword = "invalidPassword",
  userNotFound = "userNotFound",
  emailNotVerified = "emailNotVerified",
  emailAlreadyVerified = "emailAlreadyVerified",
  invalidEmailVerifyCode = "invalidEmailVerifyCode",
  invalidChangePasswordCode = "invalidChangePasswordCode",
}

export const registerSchema = {
  body: {
    type: "object",
    required: ["name", "email", "password"],
    properties: {
      name,
      email,
      password,
    },
  } as const,
  response: {
    200: {
      type: "object",
      required: ["id"],
      properties: {
        id: {
          type: "string",
        },
      },
    },
    409: getErrorSchema([errorCodes.userAlreadyExists]),
  },
} as const;

export const loginSchema = {
  body: {
    type: "object",
    required: ["email", "password"],
    properties: {
      email,
      password,
    },
  },
  response: {
    200: {
      type: "object",
      required: ["token"],
      properties: {
        token: {
          type: "string",
        },
      },
    },
    401: getErrorSchema([
      errorCodes.invalidPassword,
      errorCodes.userNotFound,
      errorCodes.emailNotVerified,
    ]),
  },
} as const;

export const verifyEmailSchema = {
  body: {
    type: "object",
    required: ["code"],
    properties: {
      code: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      type: "object",
    },
    400: getErrorSchema([errorCodes.invalidEmailVerifyCode]),
  },
} as const;

export const resendVerifyEmailSchema = {
  body: {
    type: "object",
    required: ["email", "password"],
    properties: {
      email,
      password,
    },
  },
  response: {
    200: {
      type: "object",
    },
    401: getErrorSchema([errorCodes.invalidPassword, errorCodes.userNotFound]),
    409: getErrorSchema([errorCodes.emailAlreadyVerified]),
  },
} as const;

export const resetPasswordSchema = {
  body: {
    type: "object",
    required: ["email"],
    properties: {
      email,
    },
  },
  response: {
    200: {
      type: "object",
    },
    401: getErrorSchema([errorCodes.userNotFound]),
  },
} as const;

export const changePasswordSchema = {
  body: {
    type: "object",
    required: ["code", "password"],
    properties: {
      code: {
        type: "string",
      },
      password,
    },
  },
  response: {
    200: {
      type: "object",
    },
    400: getErrorSchema([errorCodes.invalidChangePasswordCode]),
  },
} as const;
