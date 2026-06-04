import argon2 from "argon2";
import { prisma } from "../../lib/prisma.js";
import type { RegisterInput } from "./auth.validation.js";

export async function registerUser(data: RegisterInput) {
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email: data.email },
        { username: data.username },
      ],
    },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await argon2.hash(data.password);

  const user = await prisma.user.create({
    data: {
      username: data.username,
      email: data.email,
      password: hashedPassword,
    },
  });

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    createdAt: user.createdAt,
  };
}