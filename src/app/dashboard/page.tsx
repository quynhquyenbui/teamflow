import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth"
import CreateProjectForm from "@/components/create-project-form"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function DashboardPage() {
  const user = await getAuthUser()
  if (!user) redirect("/login")

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

  const canCreateProject =
    user.role === "ADMIN" || user.role === "MANAGER"

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">My Projects</h1>

      {canCreateProject && <CreateProjectForm />}

      <ul className="space-y-2">
  {projects.map((p) => (
    <li key={p.id} className="border p-3 rounded">
      <Link
        href={`/dashboard/projects/${p.id}`}
        className="block hover:underline"
      >
        <h2 className="font-semibold">{p.name}</h2>
      </Link>

      <p className="text-sm text-gray-500">
        {p.description || "No description"}
      </p>

      <p className="text-xs text-gray-400">
        Status: {p.status}
      </p>
    </li>
  ))}
</ul>
    </div>
  )
}