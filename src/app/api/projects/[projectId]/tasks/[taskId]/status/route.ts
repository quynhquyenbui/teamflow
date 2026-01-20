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

  const isOwner = task.assigneeId === auth.userId
  const isAdmin = auth.role === "ADMIN" || auth.role === "MANAGER"

  if (!isOwner && !isAdmin) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 })
  }

  await prisma.task.update({
    where: { id: params.taskId },
    data: { status },
  })

  return NextResponse.json({ success: true })
}
