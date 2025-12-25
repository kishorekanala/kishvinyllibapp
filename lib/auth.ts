import bcrypt from "bcryptjs";
import prisma from "./db";

const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

export async function createUser(email: string, password: string, role = "USER") {
  const hashedPassword = await hashPassword(password);
  return prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role: role as "ADMIN" | "USER",
    },
  });
}

export async function validateUserCredentials(email: string, password: string) {
  const user = await getUserByEmail(email);
  if (!user) {
    return null;
  }

  const isPasswordValid = await verifyPassword(password, user.password);
  if (!isPasswordValid) {
    return null;
  }

  return user;
}
