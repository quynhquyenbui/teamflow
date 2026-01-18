import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth"

export async function POST(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  const auth = await getAuthUser()
  if (!auth) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  if (auth.role !== "ADMIN" && auth.role !== "MANAGER") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 })
  }

  const { title, description, deadline } = await req.json()

  if (!title) {
    return NextResponse.json(
      { message: "Title is required" },
      { status: 400 }
    )
  }

  const task = await prisma.task.create({
    data: {
      title,
      description,
      deadline: deadline ? new Date(deadline) : undefined,
      projectId: params.projectId,
    },
  })

  return NextResponse.json(task)
}

export async function GET(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  const auth = await getAuthUser()
  if (!auth) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  // Check membership
  const isMember = await prisma.projectMember.findUnique({
    where: {
      userId_projectId: {
        userId: auth.userId,
        projectId: params.projectId,
      },
    },
  })

  if (!isMember && auth.role === "MEMBER") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 })
  }

  const tasks = await prisma.task.findMany({
    where: {
      projectId: params.projectId,
    },
    include: {
      assignee: {
        select: { id: true, name: true, email: true },
      },
    },
  })

  return NextResponse.json(tasks)
}
