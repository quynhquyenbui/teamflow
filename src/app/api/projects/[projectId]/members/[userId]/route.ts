import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth"

export async function DELETE(
  req: Request,
  {
    params,
  }: {
    params: { projectId: string; userId: string }
  }
) {
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

  await prisma.projectMember.delete({
    where: {
      userId_projectId: {
        userId: params.userId,
        projectId: params.projectId,
      },
    },
  })

  return NextResponse.json({ success: true })
}