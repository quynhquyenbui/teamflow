"use client"

type Member = {
  user: {
    id: string
    name: string
  }
}

export default function AssignTask({
  projectId,
  taskId,
  members,
}: {
  projectId: string
  taskId: string
  members: Member[]
}) {
  async function assign(userId: string) {
    if (!userId) return

    await fetch(`/api/projects/${projectId}/tasks/${taskId}/assign`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    })

    location.reload()
  }

  return (
    <div className="mt-2">
      <select
        className="border rounded px-2 py-1 text-sm"
        onChange={(e) => assign(e.target.value)}
      >
        <option value="">Assign to…</option>

        {members.map((m) => (
          <option key={m.user.id} value={m.user.id}>
            {m.user.name}
          </option>
        ))}
      </select>
    </div>
  )
}
