import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if (!token) {
    redirect("/login")
  }

  return (
    <div>
      <nav className="p-4 border-b">Dashboard</nav>
      <main className="p-4">{children}</main>
    </div>
  )
}
