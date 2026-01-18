import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function UsersPage() {
  const auth = await getAuthUser()
  if (!auth) redirect("/login")

  if (auth.role !== "ADMIN" && auth.role !== "MANAGER") {
    redirect("/dashboard")
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  })

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Users</h1>

      <ul className="space-y-2">
        {users.map((u) => (
          <li key={u.id} className="border p-3 rounded">
            <p className="font-semibold">{u.name}</p>
            <p className="text-sm">{u.email}</p>
            <p className="text-xs text-gray-500">{u.role}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}