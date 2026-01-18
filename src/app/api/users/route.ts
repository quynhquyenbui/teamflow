import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  const auth = await getAuthUser()

  if (!auth) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    )
  }

  if (auth.role !== "ADMIN" && auth.role !== "MANAGER") {
    return NextResponse.json(
      { message: "Forbidden" },
      { status: 403 }
    )
  }

  const { name, email, password, role } = await req.json()

  if (!name || !email || !password || !role) {
    return NextResponse.json(
      { message: "Missing fields" },
      { status: 400 }
    )
  }

  const exists = await prisma.user.findUnique({ where: { email } })
  if (exists) {
    return NextResponse.json(
      { message: "Email already exists" },
      { status: 400 }
    )
  }

  const hashed = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
      role,
    },
  })

  return NextResponse.json(user)
}

export async function GET() {
  const auth = await getAuthUser()

  if (!auth) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    )
  }

  if (auth.role !== "ADMIN" && auth.role !== "MANAGER") {
    return NextResponse.json(
      { message: "Forbidden" },
      { status: 403 }
    )
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(users)
}
