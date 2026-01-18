import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth"

export async function POST(req: Request) {
  const user = await getAuthUser()

  // 1️⃣ Must login
  if (!user) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    )
  }

  // 2️⃣ Must be ADMIN or MANAGER
  if (user.role !== "ADMIN" && user.role !== "MANAGER") {
    return NextResponse.json(
      { message: "Forbidden" },
      { status: 403 }
    )
  }

  const { name, description } = await req.json()

  if (!name) {
    return NextResponse.json(
      { message: "Project name is required" },
      { status: 400 }
    )
  }

  const project = await prisma.project.create({
    data: {
      name,
      description,
      members: {
        create: {
          userId: user.userId, // 👈 người tạo là member
        },
      },
    },
  })

  return NextResponse.json(project)
}

export async function GET() {
  const user = await getAuthUser()
  if (!user) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    )
  }

  const projects = await prisma.project.findMany({
    where: {
      members: {
        some: {
          userId: user.userId,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(projects)
}