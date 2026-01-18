import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import TaskList from "./task-list"
import CreateTaskModal from "./create-task-modal"

export default async function ProjectPage({
  params,
}: {
  params: { projectId: string }
}) {
  const user = await getAuthUser()
  if (!user) redirect("/login")

  const project = await prisma.project.findUnique({
    where: { id: params.projectId },
    include: {
      members: {
        include: {
          user: { select: { id: true, name: true } },
        },
      },
    },
  })

  if (!project) redirect("/dashboard")

  return (
    <div>
      <h1 className="text-xl font-bold mb-2">
        {project.name}
      </h1>

      <p className="text-gray-500 mb-4">
        {project.description}
      </p>

      {(user.role === "ADMIN" || user.role === "MANAGER") && (
        <CreateTaskModal projectId={project.id} />
      )}

      <TaskList
        projectId={project.id}
        members={project.members}
        role={user.role}
        userId={user.userId}
      />
    </div>

  )
}
