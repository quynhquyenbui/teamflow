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

  const { status } = await req.json()

  const task = await prisma.task.findUnique({
    where: { id: params.taskId },
  })

  if (!task) {
    return NextResponse.json({ message: "Task not found" }, { status: 404 })
  }

  // MEMBER can only update own task
  if (auth.role === "MEMBER" && task.assigneeId !== auth.userId) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 })
  }

  const updated = await prisma.task.update({
    where: { id: params.taskId },
    data: { status },
  })

  return NextResponse.json(updated)
}
