export const errorSchema = {
  type: "object",
  properties: {
    code: {
      type: "string",
    },
    message: {
      type: "string",
    },
  },
} as const;

export function getErrorSchema(codes: string[]) {
  return {
    type: "object",
    properties: {
      code: {
        type: "string",
        enum: codes,
      },
      message: {
        type: "string",
      },
    },
  };
}
