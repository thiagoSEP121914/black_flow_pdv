import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email invalido !"),
  password: z.string().min(3, "Senha deve ter no mínimo 3 caracteres"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export default loginSchema;
