import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth"

export async function POST(
  req: Request,
  { params }: { params: { projectId: string } }
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

  const { userId } = await req.json()

  if (!userId) {
    return NextResponse.json(
      { message: "userId is required" },
      { status: 400 }
    )
  }

  // prevent duplicate
  const exists = await prisma.projectMember.findUnique({
    where: {
      userId_projectId: {
        userId,
        projectId: params.projectId,
      },
    },
  })

  if (exists) {
    return NextResponse.json(
      { message: "User already in project" },
      { status: 400 }
    )
  }

  const member = await prisma.projectMember.create({
    data: {
      userId,
      projectId: params.projectId,
    },
  })

  return NextResponse.json(member)
}