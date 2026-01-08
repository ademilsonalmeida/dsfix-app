"use server";

import { db } from "@/lib/db";
import { adminUsers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function createAdminUser(email: string, password: string, nome: string) {
  try {
    // Check if user already exists
    const existingUser = await db.query.adminUsers.findFirst({
      where: eq(adminUsers.email, email),
    });

    if (existingUser) {
      return { success: false, error: "Usuário já existe" };
    }

    // Hash password
    const senhaHash = await bcrypt.hash(password, 10);

    // Create user
    const [newUser] = await db
      .insert(adminUsers)
      .values({
        email,
        nome,
        senhaHash,
        ativo: true,
      })
      .returning();

    return { success: true, userId: newUser.id };
  } catch (error) {
    console.error("Error creating admin user:", error);
    return { success: false, error: "Erro ao criar usuário" };
  }
}

export async function verifyAdminCredentials(email: string, password: string) {
  try {
    const user = await db.query.adminUsers.findFirst({
      where: eq(adminUsers.email, email),
    });

    if (!user || !user.ativo) {
      return null;
    }

    const isValidPassword = await bcrypt.compare(password, user.senhaHash);

    if (!isValidPassword) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      nome: user.nome,
    };
  } catch (error) {
    console.error("Error verifying credentials:", error);
    return null;
  }
}
