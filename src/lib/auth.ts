import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

export type AuthPayload = {
  userId: string
  role: "ADMIN" | "MANAGER" | "MEMBER"
}

export async function getAuthUser(): Promise<AuthPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value
  if (!token) return null

  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as AuthPayload
  } catch {
    return null
  }
}