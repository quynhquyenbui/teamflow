import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth"

export async function PATCH(
  req: Request,
  { params }: { params: { taskId: string } }
) {
  const auth = await getAuthUser()
  if (!auth) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  if (auth.role !== "ADMIN" && auth.role !== "MANAGER") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 })
  }

  const { userId } = await req.json()

  const task = await prisma.task.findUnique({
    where: { id: params.taskId },
  })

  if (!task) {
    return NextResponse.json({ message: "Task not found" }, { status: 404 })
  }

  // ensure user is project member
  const member = await prisma.projectMember.findUnique({
    where: {
      userId_projectId: {
        userId,
        projectId: task.projectId,
      },
    },
  })

  if (!member) {
    return NextResponse.json(
      { message: "User is not project member" },
      { status: 400 }
    )
  }

  const updated = await prisma.task.update({
    where: { id: params.taskId },
    data: { assigneeId: userId },
  })

  return NextResponse.json(updated)
}