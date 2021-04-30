import {
  createSchema,
  ExtractDoc,
  ExtractProps,
  Type,
  typedModel,
} from "ts-mongoose";

const schema = createSchema({
  name: Type.string({ required: true }),
  email: Type.string({ required: true, unique: true }),
  password: Type.string({ required: true }),
  isEmailVerified: Type.boolean({ default: false }),
  verifyEmailCode: Type.string(),
  changePasswordCode: Type.string(),
});

export const User = typedModel("User", schema, "users");
export type UserDoc = ExtractDoc<typeof schema>;
export type UserProps = ExtractProps<typeof schema>;
