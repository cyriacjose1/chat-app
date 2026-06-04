import argon2 from "argon2";
import { prisma } from "../../lib/prisma.js";
import type { RegisterInput } from "./auth.validation.js";
import { generateToken } from "../../utils/jwt.js";
import type { LoginInput } from "./auth.validation.js";

export async function registerUser(data: RegisterInput) {
  const existingEmail = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (existingEmail) {
    throw new Error("Email already exists");
  }

  const existingUsername = await prisma.user.findUnique({
    where: {
      username: data.username,
    },
  });

  if (existingUsername) {
    throw new Error("Username already exists");
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

export async function loginUser(data: LoginInput) {
  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await argon2.verify(
    user.password,
    data.password
  );

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  const token = generateToken(user.id);

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
    },
  };
}